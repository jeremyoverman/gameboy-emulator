import RegisterTable from "./components/RegisterTable"
import { EmulatorProvider } from "./context/EmulatorContext"

function App() {
  return (
    <EmulatorProvider>
      <RegisterTable />
    </EmulatorProvider>
  )
}

export default App
