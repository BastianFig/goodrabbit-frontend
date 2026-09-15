import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchReportStatus, generateReport } from '../api/reports'

const POLL_INTERVAL_MS = 3_000        // cada 3 segundos
const POLL_TIMEOUT_MS  = 2 * 60 * 1000 // máximo 2 minutos

export function useReport() {
  const [executionId, setExecutionId] = useState<string | null>(null)
  const [startedAt,   setStartedAt]   = useState<number | null>(null)
  const [timedOut,    setTimedOut]     = useState(false)

  const generate = useMutation({
    mutationFn: generateReport,
    onSuccess: ({ executionId }) => {
      setExecutionId(executionId)
      setStartedAt(Date.now())
      setTimedOut(false)
    },
  })

  const statusQuery = useQuery({
    queryKey: ['report', executionId],
    queryFn: ({ signal }) => fetchReportStatus(executionId!, signal),
    enabled: !!executionId,
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

  function reset() {
    setExecutionId(null)
    setStartedAt(null)
    setTimedOut(false)
  }

  const isPolling =
    !!executionId &&
    !timedOut &&
    statusQuery.data?.status !== 'Completed'

  return {
    generate:     generate.mutate,
    isGenerating: generate.isPending,
    isPolling,
    report:       statusQuery.data,
    timedOut,
    error:        generate.error ?? statusQuery.error,
    reset,
  }
}
