import { UserInfo } from "./UserInfo"


//spread the props
export const UserCard = (props) =>{
    return (
        <div>
            <h2> User Details</h2>
            <UserInfo {...props} /> 
        </div>
    )
}