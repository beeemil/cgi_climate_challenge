import {useRef, useEffect} from 'react';

const GetSelectedLocatoinId = (value) => {
    const ref = useRef();

    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

export default GetSelectedLocatoinId;