import {useRef, useEffect} from 'react';

function GetSelectedLocatoinId(value) {
    const ref = useRef();

    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

export default GetSelectedLocatoinId;