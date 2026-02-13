# **Especificación Técnica: Calculadora Web de Generadores Residenciales (Lógica Avanzada)**

**Objetivo:** Crear una herramienta de dimensionamiento precisa que replique la lógica de "Sizing" profesional, priorizando la capacidad de arranque de motores en cargas pequeñas y escalando el equipo de transferencia (ATS) automáticamente.

## **1\. Arquitectura de Datos (Cargas)**

Definición de dispositivos con factores de arranque (alpha) ajustados.

### **1.1. Base de Datos de Cargas (APPLIANCES\_DB)**

const APPLIANCES \= \[  
  {   
    id: "ac",   
    name: "Air Conditioner",   
    power: 2.5,  // kW nominal  
    alpha: 3.0,  // Factor de arranque 3x (Estándar NEMA)  
    per\_room: true,   
    activeColor: "green",  
    icon: "mdi-air-conditioner"  
  },  
  {   
    id: "fridge",   
    name: "Refrigerator",   
    power: 1.2,   
    alpha: 2.0,  // Ajustado para compresores viejos  
    per\_room: false,   
    activeColor: "white",  
    icon: "mdi-fridge"  
  },  
  {   
    id: "lighting",   
    name: "Lighting",   
    power: 0.3,   
    alpha: 1.0,  // Resistivo  
    per\_room: true,   
    activeColor: "yellow",  
    icon: "mdi-lightbulb"  
  },  
  {   
    id: "pump",   
    name: "Water Pump",   
    power: 4.0,   
    alpha: 2.5,   
    per\_room: false,   
    activeColor: "blue",  
    icon: "mdi-water-pump"  
  }  
\];

## **2\. Configuración Global**

* **1-Phase:** Voltaje \= 240V (Residencial estándar)  
* **3-Phase:** Voltaje \= 208V (Comercial ligero)

## **3\. Algoritmo de Cálculo (Híbrido: Pico \+ Marcha)**

Esta función determina el tamaño del generador evaluando tanto la capacidad de sostener la carga como la capacidad de absorber el golpe de arranque. Además, calcula el ATS basado en estándares comerciales.

function calculateSizing(selectedDeviceIds, roomCount, systemConfig) {  
    let runningLoad \= 0;  
    let maxSurgeDelta \= 0; 

    // 1\. Calcular Cargas (Running y Pico Delta)  
    selectedDeviceIds.forEach(id \=\> {  
        const device \= APPLIANCES.find(d \=\> d.id \=== id);  
        const qty \= device.per\_room ? roomCount : 1;

        if (qty \> 0\) {  
            runningLoad \+= (device.power \* qty);  
              
            // Calculamos el impacto de arranque del motor más grande  
            const surgeVal \= device.power \* device.alpha;  
            const delta \= surgeVal \- device.power;  
              
            if (delta \> maxSurgeDelta) maxSurgeDelta \= delta;  
        }  
    });

    const totalRunning \= parseFloat(runningLoad.toFixed(2));  
    const totalPeak \= parseFloat((totalRunning \+ maxSurgeDelta).toFixed(2));

    // 2\. Determinar Generador Recomendado (Lógica Dual)  
      
    // Criterio A: Capacidad de Marcha (Regla del 80% de carga)  
    // El generador debe operar relajado.  
    const sizeByRunning \= totalRunning \* 1.25; 

    // Criterio B: Capacidad de Arranque (Regla del "Iron Mass")  
    // Para cargas pequeñas con picos altos (ej: 8kW run / 14kW peak),   
    // el generador nominal debe ser casi tan grande como el pico para no ahogarse.  
    // Factor 0.92: El generador nominal debe ser al menos el 92% del pico total.  
    // (Ejemplo real: 14kW Peak \* 0.92 \= 12.88 \-\> Redondea a 13kW)  
    const sizeByPeak \= totalPeak \* 0.92;

    // Tomamos el MAYOR de los dos criterios  
    let recommendedKW \= Math.max(sizeByRunning, sizeByPeak);

    // Redondeo comercial hacia arriba (Entero)  
    recommendedKW \= Math.ceil(recommendedKW);

    // Seguridad mínima: Nunca recomendar menos de 5kW si hay carga  
    if (totalRunning \> 0 && recommendedKW \< 5\) recommendedKW \= 5;

    // 3\. Calcular Amperaje y Selección de ATS  
      
    // Fórmula de Amperios (I \= P / V)  
    // Calculamos sobre la carga de funcionamiento con margen de seguridad (Running \* 1.25)  
    // o sobre la capacidad del generador recomendado, lo que sea menor, para ser realistas con la carga.  
    const designWatts \= totalRunning \* 1.25 \* 1000; // Watts  
      
    let amps \= 0;  
    if (systemConfig.phase \=== 3\) {  
        // Trifásico: Watts / (Volts \* raiz(3))  
        amps \= designWatts / (systemConfig.voltage \* 1.732);  
    } else {  
        // Monofásico: Watts / Volts  
        amps \= designWatts / systemConfig.voltage;  
    }  
    amps \= Math.round(amps);

    // Selección de ATS (Automatic Transfer Switch)  
    // Lógica de escalado comercial:   
    // \- Hasta 100A \-\> "100 Amp Switch"  
    // \- 101A a 200A \-\> "200 Amp Switch"  
    // \- 201A a 400A \-\> "400 Amp Switch"  
      
    let atsLabel \= "100 Amp Switch"; // Valor por defecto / mínimo

    if (amps \> 100 && amps \<= 200\) {  
        atsLabel \= "200 Amp Switch";  
    } else if (amps \> 200 && amps \<= 400\) {  
        atsLabel \= "400 Amp Switch";  
    } else if (amps \> 400\) {  
        atsLabel \= "Industrial Switch (" \+ amps \+ "A)";  
    }

    return {  
        running: totalRunning,  
        peak: totalPeak,  
        rec\_kw: recommendedKW,  
        amps: amps,  
        ats\_label: atsLabel, // Variable a enlazar en la UI  
        // Margen visual: (1 \- (Running / Recomendado))  
        margin\_pct: recommendedKW \> 0 ? Math.round((1 \- (totalRunning / recommendedKW)) \* 100\) : 100  
    };  
}  
