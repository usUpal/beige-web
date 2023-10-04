import {useEffect} from 'react';
import 'tippy.js/dist/tippy.css';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState} from '../../store';
import {setPageTitle} from '../../store/themeConfigSlice';


const pricingParams = () => {

    // previous code
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Pricing Params'));
    });
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    return (
        <>
            <h2 className='text-[22px] font-bold'>Pricing Params</h2>
        </>
    );
};

export default pricingParams;
