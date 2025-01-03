/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'

const Card = ({plant}) => {
  const {name, category, image, quantity, price, _id} = plant || {}

  return (
    <Link
      to={`/plant/${_id}`}
      className='col-span-1 cursor-pointer group shadow-xl p-3 rounded-xl border border-green-700'
    >
      <div className='flex flex-col gap-2 w-full text-center '>
        <div
          className='
              aspect-square 
              w-full 
              relative 
              overflow-hidden 
              rounded-xl
            '
        >
          <img
            className='
                object-cover 
                h-full 
                w-full 
                group-hover:scale-110 
                transition
              '
            src={image}
            alt='Plant Image'
          />
          <div
            className='
              absolute
              top-3
              right-3
            '
          ></div>
        </div>
        <div>
          <h2 className='font-semibold text-lg text-green-700'>{name}</h2>
          <p className='text-green-700 '>Category: {category}</p>
          <p className='text-green-700 '>Quantity: {quantity}</p>
          <p className='font-semibold text-green-700'>Price: {price} $</p>
        </div>
        
        
        
      </div>
    </Link>
  )
}

export default Card
