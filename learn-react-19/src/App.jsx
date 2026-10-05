import './App.css'
import { Greeting } from './Greeting'
import { Hello, HelloWithoutJSX } from './Hello'
import { UserDetails } from './UserDetails'
import {Welcome} from './Welcome'
import {ProductList} from './ProductList'

function Button(){
  return <button>Click Me !!</button>
}

function App() {

  return (
    <div>
     <ProductList />
    </div>
  )
}

export default App
