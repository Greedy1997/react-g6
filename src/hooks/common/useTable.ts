/**
 * table结合search组件使用hooks
 * @param { function } searchFn 列表请求方法
 * @param { object } defaultParams 列表请求默认参数
 *
 * @return { searchProps, tableProps, dispatch, loading }
 * searchProps: 搜索项相关参数，目前只支持“搜索”、“清空”两个方法
 * tableProps: table相关参数
 * dispatch: 触发列表请求的方法
 * loading: 请求状态
 */
 import { useRef, useEffect, useCallback } from 'react';
 import useFetch from './useFetch';
 
 type order = 'ascend' | 'descend';
 
 const useTable = <T>(searchFn: IFetch<IPaginationList<T>>, defaultParams?: IObject, isImmediately = true, onError?: (err: IObject) => void) => {
     const cacheParams = useRef(defaultParams);
 
     // 缓存参数
     useEffect(() => {
         cacheParams.current = defaultParams;
     }, [defaultParams]);
 
     let searchParams = useRef<IObject>({}); // 搜索项参数
 
     let paginationParams = useRef<IObject>({
         page: 1,
         pageSize: 20
     }); // table参数（分页、筛选、排序）
 
     const { data = { items: [], total: 0 }, dispatch, isLoading: loading } = useFetch(
         searchFn,
         {
             ...paginationParams.current,
             ...cacheParams.current,
             ...searchParams.current
         },
         isImmediately,
         onError
     );
 
     // 搜索
     const evSearch = (values: IObject) => {
         searchParams.current = values;
         paginationParams.current = { ...paginationParams.current, page: 1 };
         dispatch({ ...cacheParams.current, ...searchParams.current, ...paginationParams.current });
     };
 
     // 重置
     const evReset = () => {
         searchParams.current = {};
         paginationParams.current = { ...paginationParams.current, page: 1 };
         dispatch({ ...cacheParams.current, ...searchParams.current, ...paginationParams.current });
     };
 
     // 分页、排序、筛选变化时触发
     const onChange = (pagination: any, filters: any, sorter: any) => {
         paginationParams.current = {
             pageSize: pagination.pageSize,
             page: pagination.current !== paginationParams.current.page ? pagination.current : 1 // 除了选择页码的操作，其他任何table操作刷新列表都需要回到第一页
         };
 
         // 排序参数
         if (sorter.field && sorter.order) {
             paginationParams.current = {
                 ...paginationParams.current,
                 sortName: sorter.field,
                 sortType: { ascend: 'ASC', descend: 'DESC' }[sorter.order as order]
             };
         }
 
         Object.keys(filters).map(key => (paginationParams.current[key] = Array.isArray(filters[key]) ? filters[key].join(',') : filters[key])); // 筛选参数
 
         dispatch({ ...cacheParams.current, ...searchParams.current, ...paginationParams.current });
     };
 
     // 分页信息
     const pagination = {
         hideOnSinglePage: !data?.items?.length,
         showQuickJumper: true,
         showSizeChanger: true,
         showTotal: (total: number) => `共${total}条`,
         current: paginationParams.current.page,
         pageSize: paginationParams.current.pageSize,
         total: data?.total
     };
 
     // 触发请求
     const _dispatch = useCallback(
         (params?: IObject) => {
             paginationParams.current = { ...paginationParams.current, page: 1 };
             return dispatch({ ...searchParams.current, ...paginationParams.current, ...cacheParams.current, ...params });
         },
         [dispatch]
     );
 
     return {
         searchProps: { evSearch, evReset },
         tableProps: { onChange, pagination, dataSource: data?.items || [] },
         dispatch: _dispatch,
         loading
     };
 };
 
 export default useTable; 