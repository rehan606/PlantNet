/* eslint-disable react/prop-types */
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { Fragment, useState } from 'react'
import Button from '../Shared/Button/Button'
import useAuth from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import useAxiosSecure from '../../hooks/useAxiosSecure'

const PurchaseModal = ({ closeModal, isOpen, plant, refetch }) => {
  const {user} = useAuth()
  const axiosSecure = useAxiosSecure()
  const {name,  category, price, quantity, seller, _id } = plant || {}
  // Total Price Calculation
  const [totalQuantity, setTotalQuantity] = useState(1)
  const [totalPrice, setTotalPrice] = useState(price)
  const [purchaseInfo, setPurchaseInfo] = useState({
    customer: {
      name: user?.displayName,
      email: user?.email,
      image: user?.photoURL,
    },
    plantId: _id,
    price: totalPrice,
    quantity: totalQuantity,
    seller: seller?.email,
    address: '',
    status: 'pending'

  })

  const handleQuantity = value =>{
    if(value > quantity){
      setTotalQuantity(quantity)
      return toast.error('Quantity is not available in stock')
    }

    if(value < 0){
      // setTotalQuantity(1)
      return toast.error('Quantity Cannot be less then 1')
    }
    setTotalQuantity(value)
    setTotalPrice(value * price)
    setPurchaseInfo( preview => { 
      return {...preview, quantity: value, price: value * price}
    })
  }

  // Purchese Button Handler 
  const handlePurchese = async() => {
    console.log(purchaseInfo);

    try{
      await axiosSecure.post('/order', purchaseInfo)
      await axiosSecure.patch(`/plants/quantity/${_id}`, {quantityToUpdate: totalQuantity})
      refetch()
      toast.success('Order Successfull')
    } catch (err) {
      console.log(err);
    } finally{
      closeModal()
    }
    
    
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={closeModal}>
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </TransitionChild>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <DialogTitle
                  as='h3'
                  className='text-lg font-medium text-center leading-6 text-gray-900 mb-5'
                >
                  Review Info Before Purchase
                </DialogTitle>

                <hr />
                <div className='mt-5'>
                  <p className='text-sm text-gray-500 font-semibold'>Plant: <span className='text-green-600'>{name}</span></p>
                </div>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500 font-semibold'>Category: <span className='text-green-600'>{category}</span></p>
                </div>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500 font-semibold'>Customer: {user?.displayName}</p>
                </div>

                <div className='mt-2'>
                  <p className='text-sm text-gray-500 font-semibold'>Price: $ {price}</p>
                </div>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500 font-semibold'>Available Quantity: {quantity}</p>
                </div>
                {/* Quantity */}
                <div className='space-y-1 text-sm flex items-center gap-4'>
                  <label htmlFor='quantity' className='block text-gray-600 font-semibold'>
                    Quantity :
                  </label>
                  <input
                    className='w-4/12 px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white'
                    // max={quantity}
                    value={totalQuantity}
                    onChange={e => handleQuantity(parseInt(e.target.value))}
                    name='quantity'
                    id='quantity'
                    type='number'
                    placeholder='Available Quantity'
                    required
                  />
                </div>

                {/* Address  */}
                <div className='space-y-1 text-sm mb-3'>
                  <label htmlFor='address' className='block text-gray-600 font-semibold'>
                    Shipping Address
                  </label>
                  <input
                    className='w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white'
                    name='address'
                    onChange={(e)=> setPurchaseInfo( preview => { 
                      return {...preview, address: e.target.value}
                    })}
                    id='address'
                    type='text'
                    placeholder='Shipping Address'
                    required
                  />
                </div>
                <Button onClick={handlePurchese}  label={`Pay ${totalPrice} $`} />
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default PurchaseModal
