# Adaptaciones de Contexto - Sistema AromaFlow 413

## Contexto del Proyecto Identificado
**Tipo de Proyecto**: Inicialización de Sistema Multi-Agente
**Complejidad**: ALTA - 20 agentes especializados
**Stack Tecnológico**: React + Node.js + Gemini AI
**Metodología**: AromaFlow V10 con Auto-Cuestionamiento Supremo

## Adaptaciones Requeridas por Contexto

### Para Inicialización de Sistema
- **Flujo Recomendado**: COMPLETO (2-3 horas)
- **Agentes Críticos**: Ares (validación), Colin (coordinación), Elara (documentación)
- **Paralelización**: Limitada durante inicialización, secuencial preferido
- **Documentación**: Exhaustiva para establecer base de conocimiento

### Para Stack React + Node.js
- **Agentes Especializados Activados**:
  - Pixel 🎨: Para componentes React avanzados
  - Core ⚙️: Para servicios Node.js y APIs
  - Alex 🔧: Para estilos CSS y responsive
  - Michael 🕵️‍♂️: Para lógica JavaScript core

### Para Integración con Gemini AI
- **Consideraciones Especiales**:
  - Reutilizar servicios existentes (geminiService.js)
  - Mantener compatibilidad con procesadores médicos
  - Preservar configuración de modelos existente

## Patrones de Adaptación Aplicados

### Secuencial vs Paralelo
**INICIALIZACIÓN**: Secuencial para garantizar dependencias
**IMPLEMENTACIÓN**: Paralelo cuando agentes independientes
**VALIDACIÓN**: Secuencial con Ares supervisando

### Consultas Memory Bank
**FRECUENCIA**: Cada agente consulta antes de actuar
**ARCHIVOS CLAVE**: dashboard.md, knowledge.md, quality.md
**ACTUALIZACIONES**: Continuas durante proceso

### Comunicación Entre Agentes
**FORMATO**: [AGENTE]: [ACCIÓN]. [DOCUMENTACIÓN]. Paso a [SIGUIENTE].
**VALIDACIÓN**: Ares valida cada paso antes de continuar
**DOCUMENTACIÓN**: Elara actualiza dashboard automáticamente

## Configuración de Flujo Adaptada

### Fase 1: Inicialización Core (ACTUAL)
1. Elara → Persona → Context → Adapt → Maya → Echo → Colin
2. Validación Ares en cada paso crítico
3. Documentación continua en Memory Bank

### Fase 2: Configuración Especializada
1. Activación condicional de agentes especializados
2. Pixel + Core + Zen + Catalyst según necesidad
3. Testing integrado con Lila

### Fase 3: Validación Final
1. Ares ejecuta auditoría completa
2. Zen valida UX del sistema
3. Echo registra patrones para futuros proyectos

## Métricas Adaptadas al Contexto
- **Tiempo Objetivo**: 2-3 horas (Flujo COMPLETO)
- **Calidad**: 100% sin compromisos
- **Agentes Activos**: 12 core + 8 especializados según necesidad
- **Documentación**: 3 archivos Memory Bank + archivos específicos

## Triggers Contextuales Configurados
- **nuevo_proyecto**: ✅ ACTIVADO (inicialización en curso)
- **implementacion_iniciada**: STANDBY
- **error_detectado**: ACTIVO (Echo monitoreando)
- **auditoria_solicitada**: ACTIVO (Ares supervisando)
- **innovacion_requerida**: STANDBY (Catalyst disponible)
