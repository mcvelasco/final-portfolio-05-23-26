import React from 'react'

type State = { hasError: boolean; error?: Error }

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: {}) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(_error: Error, _info: any) {
    // Intentionally ignore params; add logging here if desired
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0e1514] text-white p-8">
          <div className="glass-panel p-8 rounded-xl max-w-2xl">
            <h2 className="text-2xl font-bold text-[#59de9b] mb-4">Something went wrong</h2>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap">{String(this.state.error)}</pre>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
