export const UserDetails = ({name,isOnline,hideOffline,isPremium,isNewUser}) =>{
    
    if(hideOffline && !isOnline){
        return null
    }

    const isNewPremiumOnlineUser = isPremium && isOnline && isOnline ? "Special Online User" : "Nornal user"

    return (
        <div>
            <p>{isNewPremiumOnlineUser}</p>
            <h3>
                {name}
                {isPremium && <span>*</span>}
                {isNewUser && <span>&</span>}
                
            </h3>
            <span>{isOnline ? "Online" : "Offline"}</span>
            <p>{isOnline ? "Available for chat" : "Not online!Sigh"}</p>
            {
                isOnline ? (
                        <button>Send Message</button>):(
                        <small>Check back later</small>
                        )
                
            }
        </div>
    )

    if(isOnline){
        return (
            <div>
                <h3>{name}</h3>
                <span>Online....</span>
                <button>Send message</button>
            </div>
        )
    }
    
    return (
            <div>
                <h3>{name}</h3>
                <span>##Offline ##</span>
                <small>Check back later</small>
            </div>
        )
}