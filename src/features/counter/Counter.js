import { useDispatch, useSelector } from 'react-redux'
import { decrement, increment } from './counterSlice'

export function Counter() {
  const dispatch = useDispatch()


  const { 
    selectedValue,  
    selectedValue2 
  } = useSelector(({ codeReducer, counter }) => ({
    selectedValue: codeReducer.value,
    selectedValue2: counter.value
  }));


  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment(5))}
        >
          Increment
        </button>
        <span>{selectedValue}</span>
        {selectedValue2}
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  )
}