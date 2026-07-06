import { useEffect } from 'react';
import { useAppDispatch } from '../contexts/AppContext';

export const usePageTitle = (title: string): void => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch({ type: 'CHANGE_PAGE_TITLE', payload: title });
    }, [dispatch, title]);
};
