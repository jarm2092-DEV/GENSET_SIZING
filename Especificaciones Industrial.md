Especificación Técnica: Calculadora Web de Generadores (Lógica Industrial Integrada)

Objetivo: Implementar la lógica de cálculo precisa para escenarios Industriales y Residenciales, respetando los umbrales de cambio de voltaje, factores de arranque y reglas de validación de carga mínima (Carga Base).

1. Arquitectura de Datos (Cargas)

1.1. Base de Datos de Cargas Residenciales (APPLIANCES_DB)

(Se mantiene la estructura estándar para el modo residencial).

const APPLIANCES = [
  { 
    id: "ac", 
    name: "Air Conditioner", 
    power: 2.5,  // kW nominal
    alpha: 3.0,  // Factor de arranque 3x (Estándar NEMA)
    per_room: true, 
    activeColor: "green",
    icon: "mdi-air-conditioner"
  },
  { 
    id: "fridge", 
    name: "Refrigerator", 
    power: 1.2, 
    alpha: 2.0, 
    per_room: false, 
    activeColor: "white",
    icon: "mdi-fridge"
  },
  { 
    id: "lighting", 
    name: "Lighting", 
    power: 0.3, 
    alpha: 1.0, 
    per_room: true, 
    activeColor: "yellow",
    icon: "mdi-lightbulb"
  },
  { 
    id: "pump", 
    name: "Water Pump", 
    power: 4.0, 
    alpha: 2.5, 
    per_room: false, 
    activeColor: "blue",
    icon: "mdi-water-pump"
  }
];


1.2. Factores de Arranque Industrial

Para la pestaña "Industrial", usar estos factores para el cálculo del pico del motor más grande:

DOL (Direct On Line): Factor 6.0

Star-Delta: Factor 3.0

Soft Starter: Factor 2.0

VFD: Factor 1.3

2. Algoritmo de Cálculo Unificado

Esta función maneja tanto el modo residencial (lista de equipos) como el industrial (inputs manuales), aplicando las reglas de voltaje y la validación crítica de "Carga Base Cero".

/**
 * Calcula el dimensionamiento del generador
 * @param {string} mode - "residential" | "industrial"
 * @param {Object} inputs - Datos de entrada según el modo
 * @returns {Object} Resultados calculados
 */
function calculateGenerator(mode, inputs) {
    let totalRunning = 0;
    let totalPeak = 0;
    let isValidIndustrial = true; // Bandera para validar la regla de 0 kW

    // --- PASO 1: CALCULAR CARGAS (WATTS) ---
    
    if (mode === "residential") {
        // Lógica Residencial (Sumatoria de dispositivos)
        let maxSurgeDelta = 0;
        
        inputs.selectedDevices.forEach(item => {
            // item = { id, power, alpha, per_room, ... }
            const qty = item.per_room ? inputs.roomCount : 1;
            totalRunning += (item.power * qty);

            // Delta de arranque para el dispositivo más grande
            const surgeVal = item.power * item.alpha;
            const delta = surgeVal - item.power;
            if (delta > maxSurgeDelta) maxSurgeDelta = delta;
        });
        
        totalPeak = totalRunning + maxSurgeDelta;

    } else {
        // Lógica Industrial (Inputs Manuales)
        // inputs = { runningLoad, motorLoad, startMethodFactor }
        
        // REGLA CRÍTICA: Si Running Load es 0, no se calcula recomendación
        // Solo se calcula el pico informativo del motor para mostrar en la gráfica/info.
        if (inputs.runningLoad === 0) {
            isValidIndustrial = false;
            totalRunning = 0; // Se fuerza a 0 en la info visual
            // El pico es solo el arranque del motor (0 base + motor * factor)
            totalPeak = inputs.motorLoad * inputs.startMethodFactor;
        } else {
            isValidIndustrial = true;
            // El Running total es la carga base + la carga del motor en marcha
            totalRunning = inputs.runningLoad + inputs.motorLoad;

            // El Pico es el Running Total + El pico EXTRA solo del motor al arrancar
            // Impacto en el sistema = (RunningBase) + (Motor * Factor)
            totalPeak = inputs.runningLoad + (inputs.motorLoad * inputs.startMethodFactor); 
        }
    }

    // Redondeo a 2 decimales para limpieza interna
    totalRunning = Math.round(totalRunning * 100) / 100;
    totalPeak = Math.round(totalPeak * 100) / 100;


    // --- PASO 2: DIMENSIONAMIENTO DEL GENERADOR (kW) ---

    let recommendedKW = 0;

    if (mode === "industrial" && !isValidIndustrial) {
        // Si no es válido (Running Load 0), la recomendación es 0 obligatoriamente
        recommendedKW = 0;
    } else {
        // Regla: Capacidad para Running + 25% de Margen (Regla del 80%)
        recommendedKW = totalRunning * 1.25;

        // Validación de Pico:
        // Aseguramos que el generador cubra el pico (con factor de seguridad 0.9)
        const peakRequirement = totalPeak * 0.9;
        
        if (peakRequirement > recommendedKW) {
            recommendedKW = peakRequirement;
        }

        // Redondeo al entero superior (Ceiling)
        recommendedKW = Math.ceil(recommendedKW);

        // Evitar ceros si hay carga válida
        if (totalRunning > 0 && recommendedKW < 1) recommendedKW = 1;
    }


    // --- PASO 3: DETERMINAR CONFIGURACIÓN ELÉCTRICA (VOLTAJE/FASES) ---
    
    let voltage = 240; 
    let voltageLabel = "120/240 V";
    let phaseLabel = "1 Ph";
    // let wireConfig = "3 Wire"; 

    if (mode === "industrial") {
        // Regla: Cambio de voltaje al llegar a 12kW RECOMENDADOS (inclusive)
        if (recommendedKW >= 12) {  
            voltage = 480; 
            voltageLabel = "480/277 V";
            phaseLabel = "3 Ph";
            // wireConfig = "4 Wire"; 
        } else {
            voltage = 240;
            voltageLabel = "120/240 V";
            phaseLabel = "1 Ph";
        }
    } else {
        // Residencial estándar siempre
        voltage = 240;
        voltageLabel = "120/240 V";
        phaseLabel = "1 Ph";
    }


    // --- PASO 4: CALCULAR AMPERAJE Y ATS ---

    let amps = 0;
    let atsLabel = "100 Amp Switch";

    // Si la recomendación es 0, los Amperios y ATS también deben resetearse o ser mínimos
    if (recommendedKW > 0) {
        const designWatts = recommendedKW * 1000; 

        if (phaseLabel === "3 Ph") {
            amps = designWatts / (voltage * 1.73205);
        } else {
            amps = designWatts / voltage;
        }
        
        amps = Math.round(amps);

        // Selección de ATS Comercial
        if (amps > 100) atsLabel = "200 Amp Switch";
        if (amps > 200) atsLabel = "400 Amp Switch";
        if (amps > 400) atsLabel = `Industrial ATS (${amps}A)`;
    } else {
        // Estado base si no hay recomendación
        amps = 0;
        atsLabel = "100 Amp Switch"; 
    }

    return {
        runningKW: totalRunning,
        peakKW: totalPeak,
        recommendedKW: recommendedKW,
        specs: {
            volt: voltageLabel,
            phase: phaseLabel,
            freq: "60 Hz", 
            mode: "Standby"
        },
        electrical: {
            amps: amps,
            ats: atsLabel
        },
        // Margen visual: Si recommended es 0, margen es 0%
        marginPct: recommendedKW > 0 ? Math.round((1 - (totalRunning / recommendedKW)) * 100) : 0
    };
}