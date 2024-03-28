import { Select as AntSelect } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { SelectProps as AntSelectProps, SelectValue } from "antd/es/select";
import { uniqBy } from "lodash";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { catchError, map, Observable, of } from "rxjs";
import { useJob } from "src/core/hooks";
import { useDebounceFn } from "src/core/hooks/useDebounceFn";

interface SelectProps<VT extends SelectValue = SelectValue>
  extends AntSelectProps<VT> {
  size?: SizeType;
}

const Select = ({ size = "middle", ...props }: SelectProps) => {
  return <AntSelect {...props} optionFilterProp="label" size={size} />;
};

Select.Option = AntSelect.Option;
Select.OptGroup = AntSelect.OptGroup;

export type OptionType = {
  value: string | number;
  label: string;
  additional_data?: any;
};

export interface SelectFetchResponse {
  hasMore?: boolean;
  options: OptionType[];
}

export interface SelectFetchFunc {
  (
    searchText: string,
    page: number,
    extra: any,
    dependencies: any[]
  ): Observable<SelectFetchResponse>;
}

interface AjaxSelectProps<
  Mode extends "multiple" | "tags" | undefined = undefined
> extends Omit<SelectProps, "onChange" | "mode"> {
  fetchFunc: SelectFetchFunc;
  renderOption?: (record: OptionType, index: number) => ReactNode;
  extra?: any;
  dependencies?: any[];
  dependenciesWait?: number;
  onFetched?: (
    response: SelectFetchResponse,
    page: number,
    extra: any,
    dependencies: any[]
  ) => void;
  onDependenciesChanged?: () => void;
  onChange?: Mode extends "multiple"
    ? (value: any[], options: OptionType[]) => void
    : (value: any, option: OptionType) => void;
  mode?: Mode;
  disabledOptions?: (string | number)[];
  extraOptions?: OptionType[];
}

Select.Ajax = ({
  fetchFunc,
  renderOption,
  dependencies = [],
  dependenciesWait = 500,
  extra,
  onFetched,
  onChange,
  onDependenciesChanged,
  mode,
  disabledOptions,
  extraOptions,
  ...props
}: AjaxSelectProps) => {
  const [options, setOptions] = useState<OptionType[]>([]);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const updateStatesFromFetchResponse = useCallback(
    (fetchResponse: SelectFetchResponse) => {
      setOptions((state) => {
        if (page === 1) {
          return fetchResponse.options;
        }
        return [...state, ...fetchResponse.options];
      });
      setHasMore(fetchResponse.hasMore || false);

      onFetched && onFetched(fetchResponse, page, extra, dependencies);
    },
    [page, extra, dependencies, onFetched]
  );

  const { run: fetchData, processing: loading } = useJob(
    useCallback(() => {
      return fetchFunc(searchText, page, extra, dependencies).pipe(
        map((selectFetchResponse) => {
          updateStatesFromFetchResponse(selectFetchResponse);
        }),
        catchError((error) => {
          updateStatesFromFetchResponse({
            hasMore: false,
            options: [],
          });

          return of(error);
        })
      );
    }, [page, searchText, dependencies, extra, fetchFunc])
  );

  const canFetch = useMemo(() => {
    if (!searchText) {
      return !loading && hasMore;
    } else {
      return !loading;
    }
  }, [loading, hasMore, searchText]);

  const { run: reloadData } = useDebounceFn(
    useCallback(() => {
      if (searchText !== "" || page !== 1) {
        setPage(1);
        setSearchText("");
      } else {
        fetchData();
      }
    }, [fetchData]),
    { wait: dependenciesWait }
  );

  const onFocus = useCallback(async () => {
    if (options.length || !canFetch) {
      return;
    }
    setPage(1);
    fetchData();
  }, [options, fetchData, canFetch]);

  const onSearch = useCallback(async (text: string) => {
    setSearchText(text);
    setPage(1);
  }, []);

  const onPopupScroll = useCallback(
    async (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
      if (loading) {
        return;
      }

      const target = e.nativeEvent.target as HTMLDListElement;
      if (target.scrollHeight - target.scrollTop <= target.clientHeight * 2) {
        setPage((state) => state + 1);
      }
    },
    [loading, options, fetchFunc]
  );

  useEffect(() => {
    if (!!searchText) {
      fetchDataSearch();
    } else {
      fetchData();
    }
  }, [searchText, page]);

  useEffect(() => {
    onDependenciesChanged && onDependenciesChanged();
    setHasMore(true);
    reloadData();
  }, [...(dependencies || [])]);

  // Handle change
  const handleChange = useCallback(
    (value: any) => {
      if (!onChange) {
        return;
      }

      if (mode === "multiple" && Array.isArray(value)) {
        const foundOptions = options.filter((opt) => value.includes(opt.value));

        onChange(value, foundOptions as any);
        return;
      }

      const option = options.find((opt) => opt.value === value);

      if (!option) {
        return;
      }

      onChange(value, option as any);
    },
    [options, onChange, mode]
  );

  const { run: fetchDataSearch } = useDebounceFn(
    useCallback(() => {
      fetchData();
    }, [searchText, fetchData]),
    { wait: 300 }
  );

  // Handle disabled options
  const combinedOptions = useMemo(() => {
    const result: OptionType[] = options.map((option) => ({
      ...option,
      disabled: disabledOptions?.includes(option.value),
    }));

    if (extraOptions && searchText.length === 0) {
      result.push(...extraOptions);
    }

    return uniqBy(result, "value");
  }, [options, disabledOptions, extraOptions, searchText]);

  return (
    <Select
      {...props}
      options={renderOption ? undefined : combinedOptions}
      onFocus={onFocus}
      loading={loading}
      onPopupScroll={onPopupScroll}
      onSearch={onSearch}
      onChange={handleChange}
      showSearch={props.showSearch ?? true}
    >
      {renderOption
        ? uniqBy(combinedOptions, "value").map((option, index) => (
            <Select.Option key={index} value={option.value}>
              {renderOption(option, index)}
            </Select.Option>
          ))
        : null}
    </Select>
  );
};

export default Select;
