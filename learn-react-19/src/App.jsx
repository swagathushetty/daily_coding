import './App.css'
import { Greeting } from './Greeting'
import { Hello, HelloWithoutJSX } from './Hello'
import { UserDetails } from './UserDetails'
import {Welcome} from './Welcome'


function Button(){
  return <button>Click Me !!</button>
}

function App() {

  return (
    <div>
      <UserDetails name="swagath" isOnline={true} isPremium={true} isNewUser={true}/>
       <UserDetails name="clarik" isOnline={false} hideOffline={true} isNewUser={true} />
    </div>
  )
}

export default App
