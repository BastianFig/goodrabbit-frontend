import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchReportStatus, generateReport } from '../api/reports'

const POLL_INTERVAL_MS = 3_000       // pregunta cada 3 segundos
const POLL_TIMEOUT_MS  = 2 * 60 * 1000  // para de preguntar después de 2 minutos

export function useReport() {
  // executionId: el ID que nos da la API al generar el reporte
  // Sin él no podemos hacer polling (no sabemos qué reporte consultar)
  const [executionId, setExecutionId] = useState<string | null>(null)

  // startedAt: momento en que arrancó el polling (para calcular el timeout)
  const [startedAt, setStartedAt] = useState<number | null>(null)

  // timedOut: true si pasaron 2 min sin que la API dijera "Completed"
  const [timedOut, setTimedOut] = useState(false)

  // ─── FASE 1: disparar el POST ────────────────────────────────────────────
  // useMutation para acciones manuales (el usuario clickea el botón)
  const generate = useMutation({
    mutationFn: generateReport,
    onSuccess: ({ executionId }) => {
      // Guardamos el ID y el momento de inicio para el polling
      setExecutionId(executionId)
      setStartedAt(Date.now())
      setTimedOut(false)
    },
  })

  // ─── FASE 2: polling del estado ──────────────────────────────────────────
  // useQuery con refetchInterval para repetir el GET automáticamente
  const statusQuery = useQuery({
    queryKey: ['report', executionId],
    queryFn: ({ signal }) => fetchReportStatus(executionId!, signal),

    // enabled: false = query desactivada hasta que tengamos un executionId
    enabled: !!executionId,

    // refetchInterval: cuánto esperar entre consultas
    // Si devuelve false → para el polling
    // Si devuelve un número → espera ese tiempo y vuelve a consultar
    refetchInterval: (query) => {
      if (query.state.data?.status === 'Completed') return false

      if (startedAt !== null && Date.now() - startedAt > POLL_TIMEOUT_MS) {
        // setTimeout(0) para ejecutar el setState fuera del ciclo de TanStack
        setTimeout(() => setTimedOut(true), 0)
        return false
      }

      return POLL_INTERVAL_MS
    },
  })

  // Vuelve todo al estado inicial (para el botón "Generar nuevo reporte")
  function reset() {
    setExecutionId(null)
    setStartedAt(null)
    setTimedOut(false)
  }

  // isPolling: hay un job en curso que todavía no terminó ni expiró
  const isPolling =
    !!executionId &&
    !timedOut &&
    statusQuery.data?.status !== 'Completed'

  return {
    generate:     generate.mutate,   // función para disparar el POST
    isGenerating: generate.isPending, // true mientras espera la respuesta del POST
    isPolling,                        // true mientras el GET sigue consultando
    report:       statusQuery.data,   // los datos del reporte cuando llegan
    timedOut,                         // true si pasaron 2 min sin Completed
    error:        generate.error ?? statusQuery.error, // cualquier error de las dos fases
    reset,                            // función para volver al estado inicial
  }
}
