import Toast from './Toast'
import { useTransition } from 'react-spring'
import style from './ToastMenu.module.css'

export default function ToastContainer({ toasts=[] }){
  const styledToasts = useTransition(
    toasts, 
    {
      from: { right: '-120%' },
      enter:{right: '0%'},
      leave: { right: '-120%' },
    })

  return(
    <div className={style.toastContainer} style={{overflow: 'hidden'}}>
      {styledToasts((styles, item)=>(
        <Toast key={item.id} data={item} styles={styles}/>
      ))}
    </div>
  )
}