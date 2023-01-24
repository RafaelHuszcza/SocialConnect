import { useEffect } from "react";
import { useToast } from '../../../context/toastContext'
import style from "../ToastMenu.module.css"

import { ExclamationCircleOutlined, CloseCircleOutlined, 
  CheckCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";

import { animated } from 'react-spring'



const icons = {
  success: <CheckCircleOutlined />,
  warning: <QuestionCircleOutlined />,
  error: <ExclamationCircleOutlined />
}

const bg = {
  success: "#b7fa9f",
  warning: "#ffe893",
  error: "#FF978B"
}

export default function Toast({ data, styles }){
  const { removeToast } = useToast()

  useEffect(()=>{
    const removeTimer = setTimeout(()=>{
      removeToast(data.id)
    },3000)

    return ()=>{
      clearTimeout(removeTimer)
    }
    
  },[data.id, removeToast])

  return(
    <animated.div className={style.toast} style={{backgroundColor: bg[data.type], ...styles}}>
      { icons[data.type] }
      <div>
        <strong>{data.title}</strong>
        {data.message && <p>{data.message}</p>}
      </div>
      <CloseCircleOutlined onClick={()=>{removeToast(data.id)}}/>
    </animated.div>
  )
}