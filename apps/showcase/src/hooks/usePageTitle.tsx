import { useEffect } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { changePageTitle } from '../redux/reducers/app';

export const usePageTitle = (title: string): void => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(changePageTitle(title));
    }, [dispatch, title]);
};
