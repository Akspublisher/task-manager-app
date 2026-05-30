import { useContext } from 'react'
import { ThemeContext } from './ThemeContext'
import { Moon, Sun } from 'lucide-react'

const ThemeToggle = () => {
  const { dark, setDark } = useContext(ThemeContext)
  
  return (
    <button 
      onClick={() => setDark(!dark)}
      className="p-2 rounded bg-gray-200 dark:bg-gray-700"
    >
      {dark? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}