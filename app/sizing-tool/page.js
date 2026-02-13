'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Logo from '@/components/Logo';
import styles from './sizing-tool.module.css';

/**
 * Dispositivos iniciales con sus valores por defecto.
 */
const INITIAL_DEVICES = [
    { id: 'ac', name: 'Air Conditioner', runningKW: 2.5, alpha: 3, icon: 'ac' },
    { id: 'refrigerator', name: 'Refrigerator', runningKW: 1.2, alpha: 2, icon: 'fridge' },
    { id: 'lighting', name: 'Lighting', runningKW: 0.3, alpha: 1, icon: 'light' },
    { id: 'waterPump', name: 'Water Pump', runningKW: 4.0, alpha: 2.5, icon: 'pump' },
];

/**
 * Cálculo del generador recomendado basado en la regla del 80% 
 * y cobertura total de la carga pico.
 */
function getRecommendedSize(runningLoad, peakLoad, isIndustrial = false, baseLoad = null) {
    if (runningLoad === 0) return 0;

    // Regla Crítica Industrial: Si la carga base es 0, no se recomienda generador
    if (isIndustrial && baseLoad === 0) return 0;

    // Criterio A: Capacidad de Marcha (Regla del 80%)
    const sizeByRunning = runningLoad * 1.25;

    // Criterio B: Capacidad de Arranque
    // Factor 0.92 para residencial y 0.9 para industrial (más conservador)
    const peakFactor = isIndustrial ? 0.9 : 0.92;
    const sizeByPeak = peakLoad * peakFactor;

    // Tomamos el mayor de los dos criterios
    let recommended = Math.max(sizeByRunning, sizeByPeak);

    // Seguridad mínima
    if (!isIndustrial) {
        if (recommended < 5) recommended = 5;
    } else {
        // En industrial, si hay carga, aseguramos al menos 0.5kW (si el redondeo no lo cubre)
        if (recommended < 0.5 && runningLoad > 0) recommended = 0.5;
    }

    // Redondeo comercial
    return Math.ceil(recommended);
}


/**
 * Diagrama SVG interactivo del ATS.
 */
function AtsDiagram({ active, installationType, t, phaseLabel, voltageLabel }) {
    const colorActive = "#007AFF";
    const colorInactive = "#222b36";
    const colorUtility = active ? colorActive : colorInactive;

    return (
        <div className={styles.diagramWrapper}>
            <svg viewBox="0 0 420 220" className={styles.diagramSvg} style={{ filter: 'drop-shadow(0 0 10px rgba(0,122,255,0.15))' }}>
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                        <path d="M2,2 L8,5 L2,8" fill="none" stroke="#007AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </marker>
                    <linearGradient id="boxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0a1526" />
                        <stop offset="100%" stopColor="#05080e" />
                    </linearGradient>
                </defs>

                {/* --- ELECTRIC TOWER --- */}
                <g stroke={colorUtility} strokeWidth="1.5" fill="none" opacity={active ? 1 : 0.4}>
                    <path d="M40 180 L80 180 M60 180 L60 40" />
                    <path d="M40 180 L60 40 L80 180" />
                    <path d="M48 150 L72 150 M52 120 L68 120 M55 90 L65 90" />
                    <path d="M35 55 L85 55 M40 45 L80 45" />
                </g>

                {/* --- LINE: Utility to ATS (Only if ON) --- */}
                {active && (
                    <path
                        d="M85 110 L185 110"
                        stroke={colorActive}
                        strokeWidth="2"
                        fill="none"
                        markerEnd="url(#arrowhead)"
                        style={{ color: colorActive }}
                    />
                )}

                {/* --- GENERATOR UNIT --- */}
                <g transform="translate(100, 145)">
                    <rect x="0" y="0" width="65" height="42" rx="4" stroke={colorActive} strokeWidth="2" fill="url(#boxGrad)" />
                    <path d="M8 10 H35 M8 16 H35 M8 22 H35 M8 28 H35" stroke={colorActive} strokeWidth="1" opacity="0.4" />
                    <path d="M50 10 L44 22 H54 L48 34" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </g>

                {/* --- LINES FLOW LOGIC --- */}
                {active ? (
                    /* ATS ON: Flow from Gen to ATS (L-bracket) */
                    <path
                        d="M165 165 L212 165 L212 145"
                        stroke={colorActive}
                        strokeWidth="2"
                        fill="none"
                        markerEnd="url(#arrowhead)"
                        style={{ color: colorActive }}
                    />
                ) : (
                    /* ATS OFF: Utility Disconnected, Gen to House Direct */
                    <path
                        d="M165 165 L290 165 L290 120 L310 120"
                        stroke={colorActive}
                        strokeWidth="2"
                        fill="none"
                        markerEnd="url(#arrowhead)"
                        style={{ color: colorActive }}
                    />
                )}

                {/* --- ATS BOX --- */}
                <g transform="translate(190, 85)" opacity={active ? 1 : 0.3}>
                    <rect x="0" y="0" width="45" height="55" rx="6" stroke={active ? colorActive : "#555"} strokeWidth="2" fill="url(#boxGrad)" />
                    <rect x="10" y="12" width="25" height="12" rx="6" fill={active ? "#34C759" : "#333"} />
                    <circle cx={active ? 28 : 17} cy="18" r="4.5" fill="#fff" />
                    <text x="22.5" y="46" textAnchor="middle" fill="#007AFF" fontSize="10" fontWeight="900">ATS</text>
                </g>

                {/* --- LINE: ATS to House (Only if ON) --- */}
                {active && (
                    <path
                        d="M235 115 L310 115"
                        stroke={colorActive}
                        strokeWidth="2"
                        fill="none"
                        markerEnd="url(#arrowhead)"
                        style={{ color: colorActive }}
                    />
                )}


                {/* Edificio: Casa o Industrial */}
                <g transform="translate(320, 60)" stroke={colorActive} strokeWidth="2" fill="none">
                    {/* Estructura Base */}
                    {installationType === 'industrial' ? (
                        <>
                            {/* Edificio Industrial / Warehouse */}
                            <path d="M0 105 V45 H80 V105 H0 Z" fill={active ? "rgba(0,122,255,0.05)" : "none"} />
                            <path d="M0 45 L40 25 L80 45" />
                            <g opacity="0.4">
                                <rect x="10" y="55" width="20" height="15" />
                                <rect x="45" y="55" width="20" height="15" />
                                <rect x="10" y="80" width="20" height="15" />
                                <rect x="45" y="80" width="20" height="15" />
                            </g>
                        </>
                    ) : (
                        <>
                            {/* Casa Residencial */}
                            <path d="M0 105 V65 L40 35 L80 65 V105 H0 Z" fill={active ? "rgba(0,122,255,0.05)" : "none"} />
                            <path d="M0 65 L40 35 L80 65" strokeWidth="3" strokeOpacity="0.3" />
                            <rect x="25" y="75" width="30" height="30" strokeOpacity="0.4" />
                        </>
                    )}
                </g>
            </svg>
        </div>
    );
}

export default function SizingToolPage() {
    const { t } = useLanguage();
    const [step, setStep] = useState(1);
    const [method, setMethod] = useState(null);
    const [installationType, setInstallationType] = useState(null);
    const [rooms, setRooms] = useState(1);
    const [ats, setAts] = useState(true);
    const [langState, setLangState] = useState('en');
    const [indRunning, setIndRunning] = useState(0);
    const [indMotor, setIndMotor] = useState(0);
    const [motorStart, setMotorStart] = useState('DOL');
    const [devices, setDevices] = useState(INITIAL_DEVICES);
    const [phase, setPhase] = useState('1ph');
    const [selectedDevices, setSelectedDevices] = useState({
        ac: 1,
        refrigerator: 1,
        lighting: 1,
        waterPump: 0,
    });

    const handleIndRunningChange = (val) => {
        const num = parseFloat(val);
        setIndRunning(isNaN(num) ? 0 : Math.max(0, num));
    };

    const handleIndMotorChange = (val) => {
        const num = parseFloat(val);
        setIndMotor(isNaN(num) ? 0 : Math.max(0, num));
    };

    const updateDeviceKW = (id, val) => {
        const num = parseFloat(val) || 0;
        setDevices(prev => prev.map(d => d.id === id ? { ...d, runningKW: num } : d));
    };

    const updateDeviceCount = (id, delta) => {
        setSelectedDevices(prev => ({
            ...prev,
            [id]: Math.max(0, prev[id] + delta)
        }));
    };

    const { runningLoad, peakLoad, maxSurgeDelta } = useMemo(() => {
        if (installationType === 'industrial') {
            const multipliers = { 'DOL': 6.0, 'STAR': 3.0, 'SOFT': 2.0, 'VFD': 1.3 };
            const factor = multipliers[motorStart] || 6.0;
            const base = parseFloat(indRunning) || 0;
            const motor = parseFloat(indMotor) || 0;

            let totalRunning = 0;
            const motorSurge = motor * factor;
            let totalPeak = 0;

            if (base === 0) {
                totalRunning = 0;
                totalPeak = motorSurge;
            } else {
                totalRunning = base + motor;
                totalPeak = base + motorSurge;
            }

            return {
                runningLoad: Math.round(totalRunning * 100) / 100,
                peakLoad: Math.round(totalPeak * 100) / 100,
                maxSurgeDelta: Math.round((motorSurge - motor) * 100) / 100
            };
        }

        let running = 0;
        let maxDelta = 0;
        devices.forEach(d => {
            const count = selectedDevices[d.id] || 0;
            if (count > 0) {
                running += d.runningKW * count;
                // Calculamos el delta de arranque de UNA unidad (el peor caso)
                const surgeVal = d.runningKW * d.alpha;
                const delta = surgeVal - d.runningKW;
                if (delta > maxDelta) maxDelta = delta;
            }
        });

        return {
            runningLoad: Math.round(running * 100) / 100,
            peakLoad: Math.round((running + maxDelta) * 100) / 100,
            maxSurgeDelta: Math.round(maxDelta * 100) / 100
        };
    }, [devices, selectedDevices, rooms, installationType, indRunning, indMotor, motorStart, method]);

    const recommended = useMemo(() =>
        getRecommendedSize(runningLoad, peakLoad, installationType === 'industrial', installationType === 'industrial' ? (parseFloat(indRunning) || 0) : null),
        [runningLoad, peakLoad, installationType, indRunning]);

    const atsRecommendation = useMemo(() => {
        if (runningLoad === 0) return null;

        let currentVoltage = 240;
        let is3Ph = phase === '3ph';

        if (installationType === 'industrial') {
            if (recommended >= 12) {
                currentVoltage = 480;
                is3Ph = true;
            } else {
                currentVoltage = 240;
                is3Ph = false;
            }
        } else {
            currentVoltage = phase === '3ph' ? 208 : 240;
            is3Ph = phase === '3ph';
        }

        const designWatts = recommended * 1000;
        let amps = 0;
        if (is3Ph) {
            amps = designWatts / (currentVoltage * 1.732);
        } else {
            amps = designWatts / currentVoltage;
        }

        const finalAmps = Math.round(amps);
        let switchLabel = "100 Amp Switch";

        if (finalAmps > 100 && finalAmps <= 200) {
            switchLabel = "200 Amp Switch";
        } else if (finalAmps > 200 && finalAmps <= 400) {
            switchLabel = "400 Amp Switch";
        } else if (finalAmps > 400) {
            switchLabel = `Industrial ATS (${finalAmps}A)`;
        }

        return {
            amps: finalAmps,
            switch: switchLabel,
            voltage: currentVoltage === 480 ? "480/277 V" : (currentVoltage === 208 ? "208/120 V" : "120/240 V"),
            phase: is3Ph ? "3 Ph" : "1 Ph",
            is3Ph: is3Ph
        };
    }, [runningLoad, phase, recommended, installationType]);

    const marginPercentage = useMemo(() => {
        if (!recommended || recommended === 0) return 0;
        const margin = ((recommended - runningLoad) / recommended) * 100;
        return Math.max(0, Math.round(margin));
    }, [recommended, runningLoad]);

    const chartMax = useMemo(() => {
        const base = Math.max(peakLoad, recommended, 10);
        return base + 5;
    }, [peakLoad, recommended]);

    const chartTicks = useMemo(() => {
        const ticks = [];
        const numTicks = 6;
        const step = chartMax / (numTicks - 1);
        for (let i = 0; i < numTicks; i++) {
            ticks.push(parseFloat((chartMax - i * step).toFixed(1)));
        }
        return ticks;
    }, [chartMax]);

    return (
        <>
            <Navbar />
            <main className={styles.main}>
                {/* Pasos fijos superiores */}
                <div className={styles.stepHeader}>
                    <div className={`${styles.stepItem} ${step >= 1 ? styles.stepActive : ''}`}>
                        <span className={styles.stepNum}>1</span> {t('sizingTool.steps.method')}
                    </div>
                    <div className={`${styles.stepItem} ${step >= 2 ? styles.stepActive : ''}`}>
                        <span className={styles.stepNum}>2</span> {t('sizingTool.steps.type')}
                    </div>
                    <div className={`${styles.stepItem} ${step >= 3 ? styles.stepActive : ''}`}>
                        <span className={styles.stepNum}>3</span> {t('sizingTool.steps.loads')}
                    </div>
                </div>

                <div className={styles.container}>
                    {step === 1 && (
                        <div className={styles.stepContent}>
                            <h2 className={styles.pageTitle}>{t('sizingTool.methodTitle')}</h2>
                            <div className={styles.methodGrid}>
                                <div className={styles.methodCard} onClick={() => { setMethod('visual'); setStep(2); }}>
                                    <div className={styles.methodIcon}><i className="icon-visual"></i></div>
                                    <h3>{t('sizingTool.visual')}</h3>
                                    <p>{t('sizingTool.visualDesc')}</p>
                                    <button className={styles.enterBtn}>{t('sizingTool.enter')}</button>
                                </div>
                                <div className={styles.methodCard} onClick={() => { setMethod('engineering'); setStep(3); }}>
                                    <div className={styles.methodIcon}><i className="icon-eng"></i></div>
                                    <h3>{t('sizingTool.engineering')}</h3>
                                    <p>{t('sizingTool.engineeringDesc')}</p>
                                    <button className={styles.enterBtn}>{t('sizingTool.enter')}</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className={styles.stepContent}>
                            <h2 className={styles.pageTitle}>{t('sizingTool.typeTitle')}</h2>
                            <div className={styles.methodGrid}>
                                <div className={styles.methodCard} onClick={() => { setInstallationType('residential'); setStep(3); }}>
                                    <div className={styles.methodIcon}><i className="icon-res"></i></div>
                                    <h3>{t('sizingTool.visualResidential')}</h3>
                                    <p>{t('sizingTool.residentialDesc')}</p>
                                    <button className={styles.enterBtn}>{t('sizingTool.enter')}</button>
                                </div>
                                <div className={styles.methodCard} onClick={() => { setInstallationType('industrial'); setStep(3); }}>
                                    <div className={styles.methodIcon}><i className="icon-ind"></i></div>
                                    <h3>{t('sizingTool.visualIndustrial')}</h3>
                                    <p>{t('sizingTool.industrialDesc')}</p>
                                    <button className={styles.enterBtn}>{t('sizingTool.enter')}</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className={styles.loadGrid}>
                            {/* Columna 1: Dispositivos o Industrial Inputs */}
                            <div className={styles.columnCard}>
                                {installationType === 'industrial' ? (
                                    <>
                                        <h3>{t('sizingTool.industrial.title')}</h3>
                                        <p className={styles.indDesc}>{t('sizingTool.industrial.desc')}</p>
                                        <div className={styles.deviceList}>
                                            <div className={styles.indInputRow}>
                                                <label>{t('sizingTool.industrial.runningLabel')}</label>
                                                <div className={styles.indInputWrapper}>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={indRunning}
                                                        onChange={(e) => handleIndRunningChange(e.target.value)}
                                                    />
                                                    <div className={styles.stepBtnGroup}>
                                                        <button
                                                            className={styles.stepBtn}
                                                            onClick={() => setIndRunning(prev => Math.max(0, Math.ceil(prev - 1)))}
                                                        >
                                                            −
                                                        </button>
                                                        <button
                                                            className={styles.stepBtn}
                                                            onClick={() => setIndRunning(prev => Math.floor(prev + 1))}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <span>kW</span>
                                                </div>
                                            </div>
                                            <div className={styles.indInputRow}>
                                                <label>{t('sizingTool.industrial.motorLabel')}</label>
                                                <div className={styles.indInputWrapper}>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={indMotor}
                                                        onChange={(e) => handleIndMotorChange(e.target.value)}
                                                    />
                                                    <div className={styles.stepBtnGroup}>
                                                        <button
                                                            className={styles.stepBtn}
                                                            onClick={() => setIndMotor(prev => Math.max(0, Math.ceil(prev - 1)))}
                                                        >
                                                            −
                                                        </button>
                                                        <button
                                                            className={styles.stepBtn}
                                                            onClick={() => setIndMotor(prev => Math.floor(prev + 1))}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <span>kW</span>
                                                </div>
                                            </div>
                                            <div className={styles.indInputRow}>
                                                <label>{t('sizingTool.industrial.methodLabel')}</label>
                                                <select
                                                    className={styles.indSelect}
                                                    value={motorStart}
                                                    onChange={(e) => setMotorStart(e.target.value)}
                                                >
                                                    <option value="DOL">DOL (Direct On Line)</option>
                                                    <option value="STAR">Star-Delta</option>
                                                    <option value="SOFT">Soft Starter</option>
                                                    <option value="VFD">VFD (Variable Frequency Drive)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h3>{t('sizingTool.residentialTitle')}</h3>
                                        <div className={styles.deviceList}>
                                            {devices.map(d => (
                                                <div key={d.id} className={styles.deviceRow}>
                                                    <div className={styles.deviceInfo}>
                                                        <div className={styles.countControl}>
                                                            <button onClick={() => updateDeviceCount(d.id, -1)}>−</button>
                                                            <input type="text" value={selectedDevices[d.id] || 0} readOnly />
                                                            <button onClick={() => updateDeviceCount(d.id, 1)}>+</button>
                                                        </div>
                                                        <div style={{ marginLeft: '12px' }}>
                                                            <strong>{t(`sizingTool.devices.${d.id}`)}</strong>
                                                        </div>
                                                    </div>
                                                    <div className={styles.editableKW}>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={d.runningKW}
                                                            onChange={(e) => updateDeviceKW(d.id, e.target.value)}
                                                        />
                                                        <span>kW</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className={styles.phaseSelector}>
                                            <h4>{t('sizingTool.phaseSelector.title')}</h4>
                                            <div className={styles.phaseGrid}>
                                                <div
                                                    className={`${styles.phaseOption} ${phase === '1ph' ? styles.phaseActive : ''}`}
                                                    onClick={() => setPhase('1ph')}
                                                >
                                                    {t('sizingTool.phaseSelector.single')}
                                                </div>
                                                <div
                                                    className={`${styles.phaseOption} ${phase === '3ph' ? styles.phaseActive : ''}`}
                                                    onClick={() => setPhase('3ph')}
                                                >
                                                    {t('sizingTool.phaseSelector.three')}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Columna 2: Mode Diagram */}
                            <div className={styles.columnCard}>
                                <div className={styles.cardHeader}>
                                    <h3>{t('sizingTool.mode')}</h3>
                                    <div className={styles.atsToggle}>
                                        <span className={ats ? styles.activeText : ''}>{t('sizingTool.atsOn')}</span>
                                        <button
                                            className={`${styles.toggleSwitch} ${ats ? styles.toggleOn : ''}`}
                                            onClick={() => setAts(!ats)}
                                        >
                                            <span className={styles.toggleKnob}></span>
                                        </button>
                                    </div>
                                </div>
                                <AtsDiagram
                                    active={ats}
                                    installationType={installationType}
                                    t={t}
                                    phaseLabel={atsRecommendation?.phase}
                                    voltageLabel={atsRecommendation?.voltage}
                                />
                            </div>

                            {/* Columna 3: Chart */}
                            <div className={styles.columnCard}>
                                <div className={styles.cardHeader}>
                                    <h3>{t('sizingTool.loadChart')}</h3>
                                    <span className={styles.recTitle}>{t('sizingTool.recommended')}: {recommended} kW</span>
                                </div>
                                <div className={styles.visualChart}>
                                    {chartTicks.map((v, idx) => {
                                        const topPercent = (idx / (chartTicks.length - 1)) * 100;
                                        return (
                                            <div key={idx} className={styles.chartYAxis} style={{ top: `${topPercent}%` }}>
                                                <span>{v} kW</span>
                                                <div className={styles.chartLine}></div>
                                            </div>
                                        );
                                    })}

                                    {/* Mostrar barra solo si hay carga */}
                                    {(runningLoad > 0 || peakLoad > 0) && (
                                        <div className={styles.singleBarContainer}>
                                            <div className={styles.barMainArea}>
                                                {/* Segmento de Exceso (Rojo) - Todo lo que supere la capacidad del generador recomendado */}
                                                {peakLoad > recommended && (
                                                    <div
                                                        className={styles.barSegmentExcess}
                                                        style={{
                                                            bottom: `${(recommended / chartMax) * 100}%`,
                                                            height: `${((peakLoad - recommended) / chartMax) * 100}%`
                                                        }}
                                                    >
                                                        <div className={styles.barTooltip}>
                                                            <span className={styles.dotError}></span> {t('sizingTool.chart.excess')}: {(peakLoad - recommended).toFixed(2)} kW
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Capacidad Disponible (Gris) - Espacio entre la carga continua y el límite recomendado */}
                                                {recommended > runningLoad && (
                                                    <div
                                                        className={styles.barSegmentAvailable}
                                                        style={{
                                                            bottom: `${(runningLoad / chartMax) * 100}%`,
                                                            height: `${((recommended - runningLoad) / chartMax) * 100}%`
                                                        }}
                                                    >
                                                        <div className={styles.barTooltip}>
                                                            <span className={styles.dotAvailable}></span> {t('sizingTool.chart.available')}: {(recommended - runningLoad).toFixed(2)} kW
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Carga Continua (Verde) */}
                                                <div
                                                    className={styles.barSegmentRunning}
                                                    style={{
                                                        height: `${(runningLoad / chartMax) * 100}%`
                                                    }}
                                                >
                                                    <div className={styles.barTooltip}>
                                                        <span className={styles.dotRunning}></span> {t('sizingTool.chart.running')}: {runningLoad.toFixed(2)} kW
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.legend}>
                                    <div className={styles.legendItem}>
                                        <span className={styles.legendDot} style={{ background: '#34C759' }}></span>
                                        {t('sizingTool.runningLoad')}: {runningLoad} kW
                                    </div>
                                    <div className={styles.legendItem}>
                                        <span className={styles.legendDot} style={{ background: '#FF9500' }}></span>
                                        {t('sizingTool.peakLoad')}: {peakLoad} kW
                                    </div>
                                </div>
                            </div>

                            {/* Fila Inferior: Generator Info */}
                            <div className={styles.wideCard}>
                                <h3>{t('sizingTool.info.title')}</h3>
                                <div className={styles.infoRows}>
                                    <div className={styles.infoRow}>
                                        <span>{t('sizingTool.runningLoad')}</span>
                                        <strong>{runningLoad} kW</strong>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <span>{t('sizingTool.peakLoad')}</span>
                                        <strong>{peakLoad} kW</strong>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <span>{t('sizingTool.info.recommended')}</span>
                                        <strong>{recommended} kW</strong>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <span>{t('sizingTool.info.margin')}</span>
                                        <strong>{marginPercentage} %</strong>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <span>{t('sizingTool.info.amps')} ({atsRecommendation?.voltage || (phase === '1ph' ? '120/240 V' : '208/120 V')})</span>
                                        <strong>{atsRecommendation?.amps || 0} A</strong>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <span>{t('sizingTool.info.atsSwitch')}</span>
                                        <strong>{atsRecommendation?.switch || '---'}</strong>
                                    </div>
                                </div>
                                <div className={styles.proposalBanner}>
                                    <h2>{t('sizingTool.info.proposal')} - {recommended} kW</h2>
                                    <p>{atsRecommendation?.voltage || (phase === '1ph' ? '120/240 V' : '208/120 V')} - {atsRecommendation?.phase || (phase === '1ph' ? '1 Ph' : '3 Ph')} ({atsRecommendation?.is3Ph ? '4 Wire' : '3 Wire'}) - 60 hz - {ats ? t('sizingTool.info.standby') : t('sizingTool.info.prime')}</p>
                                    <p style={{ marginTop: '5px', fontSize: '11px', opacity: 0.8 }}>
                                        {t('sizingTool.info.atsSwitch')}: {atsRecommendation?.switch || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Nav */}
                <div className={styles.bottomNav}>
                    <button className={styles.prevBtn} onClick={() => setStep(Math.max(1, step - 1))}>‹ {t('sizingTool.prev')}</button>
                    <Link href="/" className={styles.homeBtn}>{t('sizingTool.home')} 🏠</Link>
                </div>
            </main >
            <Footer />
        </>
    );
}
