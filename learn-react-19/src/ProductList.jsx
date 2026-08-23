export const ProductList = () =>{
    
    const products = [
        {
            id:1,
            name:'laptop',
            price:999
        },
        {
            id:15,
            name:'tv',
            price:766
        },
        {
            id:45,
            name:'fridge',
            price:122
        },
        ]
    
    return (
        <div>
            {products.map(({name,price,id}) =>{
                return (
                    <div>
                       <h3>{name}</h3>
                       <p>${price}</p>
                    </div>
                )
            })}
        </div>
    )
}