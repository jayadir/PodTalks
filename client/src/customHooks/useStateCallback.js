import {useCallback, useState,useRef, useEffect} from 'react';
export const useStateCallback = (initialState) => {
    const [state, setState] = useState(initialState);
    const callbackRef=useRef(null);
    const update=useCallback((value,callback)=>{
        callbackRef.current=callback;
        setState(prev=>{
            return typeof value === 'function' ? value(prev) : value;
        });
    },[])
    useEffect(()=>{
        if(!callbackRef.current) return
        callbackRef.current(state)
        callbackRef.current=null;
    },[state])
    return [state,update];
}