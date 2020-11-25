import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';

function CheckboxAndText(props){

    const changeChecked = ()=> {
        props.setChecked(!props.checked);
    }

    return(
        <div className="checkbox-wrapper">
            <Checkbox checked={props.checked} onClick={changeChecked} color="primary" />
            {props.name}
        </div>
    )
}

export default CheckboxAndText;