# Sistema de Comandos AromaFlow 413 - OPERATIVO

## Comandos Principales Activos

### `/start [solicitud]` - Colin evalúa complejidad y asigna flujo
**Estado**: ✅ OPERATIVO
**Función**: Colin analiza la solicitud, evalúa complejidad (SIMPLE/COMPLEJO/CRÍTICO) y asigna flujo automáticamente
**Agentes Involucrados**: Colin → Maya → Ares → Flujo correspondiente
**Ejemplo**: `/start crear calculadora básica` → Flujo EXPRESS

### `/express [tarea simple]` - Fuerza flujo EXPRESS
**Estado**: ✅ OPERATIVO  
**Función**: Bypass de evaluación, fuerza flujo EXPRESS (< 2 horas)
**Secuencia**: Maya → Michael/Alex → Lila → Elara → Khan
**Ejemplo**: `/express botón de contacto responsive`

### `/critical [emergencia]` - Activa flujo CRÍTICO con Johnson
**Estado**: ✅ OPERATIVO
**Función**: Emergencias, Johnson interviene, implementación mínima (< 1 hora)
**Secuencia**: Johnson → Michael → Lila → Khan
**Ejemplo**: `/critical fix error crítico en producción`

### `/status` - Dashboard en tiempo real
**Estado**: ✅ OPERATIVO
**Función**: Muestra estado actual desde dashboard.md
**Respuesta**: Progreso, agentes activos, próximos pasos
**Actualización**: Automática por Elara

### `/test` - Lila ejecuta testing inmediato
**Estado**: ✅ OPERATIVO
**Función**: Testing inmediato del proyecto actual
**Cobertura**: Unit, Integration, UI/UX, Performance
**Frecuencia**: Cada 15 minutos automático + manual

### `/audit` - Ares realiza auditoría rápida
**Estado**: ✅ OPERATIVO
**Función**: Ares aplica las 10 preguntas críticas al estado actual
**Resultado**: APROBADO/FALLA con observaciones específicas
**Poder de Veto**: Puede detener flujo si detecta fallas críticas

### `/archive` - Elara archiva información obsoleta
**Estado**: ✅ OPERATIVO
**Función**: Limpieza automática de Memory Bank
**Acción**: Mueve archivos obsoletos a memory-bank/archive/
**Criterio**: Información > 30 días o marcada como obsoleta

### `/optimize` - Sistema se auto-optimiza basado en métricas
**Estado**: ✅ OPERATIVO
**Función**: Echo analiza métricas y propone optimizaciones
**Resultado**: Catalyst genera mejoras, Ares valida, Khan aprueba
**Frecuencia**: Automático cada 10 proyectos

## Flujos Configurados y Operativos

### Flujo EXPRESS (< 2 horas)
```
Khan define → Colin evalúa → Maya analiza → Michael implementa → Lila testea → Elara documenta → Khan recibe
```
**Estado**: ✅ OPERATIVO
**Uso**: Tareas simples, componentes básicos, fixes menores

### Flujo COMPLETO (2-3 horas) 
```
Khan define → Colin evalúa → Maya analiza → Ares valida → Gordon mejora → Ares valida → 
Zara diseña → Ares valida → Colin consolida → Ares aprueba → 
PARALELO: Michael + Alex + Lila → Ares valida → Elara documenta → Khan recibe
```
**Estado**: ✅ OPERATIVO
**Uso**: Proyectos complejos, nuevas funcionalidades, arquitectura

### Flujo CRÍTICO (< 1 hora)
```
Khan EMERGENCIA → Johnson interviene → Michael implementa mínimo → Lila testea básico → Khan recibe
```
**Estado**: ✅ OPERATIVO
**Uso**: Emergencias, fixes críticos, situaciones urgentes

## Triggers Automáticos Configurados

### Trigger: nuevo_proyecto
**Activación**: Cuando Khan define nuevo objetivo
**Acción**: Persona + Context + Echo consultan automáticamente
**Estado**: ✅ ACTIVO

### Trigger: error_detectado  
**Activación**: Cualquier agente detecta error
**Acción**: Echo consulta errorTracking.md, todos consultan context
**Estado**: ✅ ACTIVO

### Trigger: implementacion_iniciada
**Activación**: Colin aprueba plan maestro
**Acción**: Pixel + Core consultan automáticamente techContext
**Estado**: ✅ ACTIVO

### Trigger: auditoria_solicitada
**Activación**: Comando /audit o validación automática
**Acción**: Zen consulta productContext + current-status
**Estado**: ✅ ACTIVO

### Trigger: innovacion_requerida
**Activación**: Catalyst detecta oportunidad de mejora
**Acción**: Catalyst consulta suggestions + systemPatterns
**Estado**: ✅ ACTIVO

## Protocolos de Comunicación Activos

### Formato Estándar
```
[AGENTE]: [ACCIÓN EJECUTADA]. [DOCUMENTACIÓN CREADA/ACTUALIZADA]. Paso a [SIGUIENTE_AGENTE].
```
**Estado**: ✅ IMPLEMENTADO
**Cumplimiento**: 100% de agentes

### Consultas Memory Bank Obligatorias
**Regla**: Todo agente consulta Memory Bank antes de actuar
**Verificación**: Automática por sistema
**Estado**: ✅ ACTIVO

### Validación Ares Suprema
**Frecuencia**: En cada paso crítico
**Poder de Veto**: Habilitado
**Re-planificación**: Obligatoria si detecta fallas
**Estado**: ✅ ACTIVO

## Sistema de Métricas Automáticas

### Métricas de Performance
- Tiempo por flujo: EXPRESS/COMPLETO/CRÍTICO
- Eficiencia por agente
- Tasa de re-planificaciones por Ares
- Cobertura de testing por Lila

### Métricas de Calidad
- Errores detectados vs corregidos
- Auditorías pasadas vs fallidas
- Satisfacción de Khan (aprobaciones)
- Innovaciones implementadas por Catalyst

**Estado General**: ✅ SISTEMA COMPLETAMENTE OPERATIVO
