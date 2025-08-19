import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

/**
 * 페이지네이션 기능에 대한 옵션을 정의합니다.
 */
export interface PaginationOptions {
    /**
     * 페이지네이션을 활성화할지 여부를 결정합니다. (기본값: false)
     */
    enabled?: boolean
    /**
     * 한 페이지에 표시할 행의 개수를 지정합니다. (기본값: 10)
     */
    pageSize?: number
    /**
     * 페이지네이션 컴포넌트의 위치를 지정합니다. (기본값: 'bottom')
     */
    position?: 'top' | 'bottom' | 'both'
    /**
     * 페이지네이션 컴포넌트의 정렬 방향을 지정합니다. (기본값: 'right')
     */
    align?: 'left' | 'center' | 'right'
    /**
     * 페이지 번호를 표시할지 여부를 결정합니다. (기본값: true)
     */
    showPageNumbers?: boolean
    /**
     * 화면에 한 번에 표시할 최대 페이지 번호의 개수를 지정합니다. (기본값: 5)
     */
    maxVisiblePages?: number
}

/**
 * 가상화(Virtualization) 기능에 대한 옵션을 정의합니다.
 * 대규모 데이터셋을 효율적으로 렌더링하기 위해 사용됩니다.
 */
export interface VirtualizationOptions {
    /**
     * 가상화를 활성화할지 여부를 결정합니다. (기본값: 페이지네이션 비활성화 시 true)
     */
    enabled?: boolean
    /**
     * 각 행의 높이를 픽셀(px) 단위로 지정합니다. (기본값: 52)
     */
    rowHeight?: number
    /**
     * 테이블을 담고 있는 컨테이너의 높이를 픽셀(px) 단위로 지정합니다. (기본값: 400)
     */
    containerHeight?: number
    /**
     * 현재 보이는 영역 외에 위아래로 추가 렌더링할 행의 개수를 지정합니다. (기본값: 5)
     */
    overscan?: number
}

export interface SearchOptions {
    /**
     * 검색을 적용할 컬럼의 키 배열입니다.
     */
    columns?: string[]
    /**
     * 검색창의 위치를 지정합니다. (기본값: 'top')
     */
    position?: 'top' | 'bottom' | 'both'
    /**
     * 검색창의 정렬 방향을 지정합니다. (기본값: 'left')
     */
    align?: 'left' | 'center' | 'right'
    /**
     * 검색창에 표시될 플레이스홀더 텍스트입니다.
     */
    placeholder?: string
}

/**
 * SSdataTable 컴포넌트의 props를 정의합니다.
 * @template TData - 테이블에 표시될 데이터의 타입입니다.
 * @template TValue - 각 셀의 값의 타입입니다.
 */
export interface DataTableProps<TData, TValue> {
    /**
     * 테이블의 컬럼 정의 배열입니다.
     * TanStack Table의 ColumnDef 타입을 따릅니다.
     */
    columns: ColumnDef<TData, TValue>[]
    /**
     * 테이블에 표시될 데이터 배열입니다.
     */
    data: TData[]
    /**
     * 페이지네이션 관련 옵션입니다.
     */
    pagination?: PaginationOptions
    /**
     * 가상화 관련 옵션입니다.
     */
    virtualization?: VirtualizationOptions
    /**
     * 검색 관련 옵션입니다.
     */
    search?: SearchOptions
}

/**
 * 셀 내용의 정렬 방향을 지정합니다.
 * - 'left': 왼쪽 정렬
 * - 'center': 가운데 정렬
 * - 'right': 오른쪽 정렬
 */
export type CellAlign = 'left' | 'center' | 'right'

/**
 * 셀에 표시될 값의 포맷 유형을 지정합니다.
 * - 'text': 일반 텍스트
 * - 'currency': 통화 형식
 * - 'percentage': 백분율 형식
 * - 'date': 날짜 형식
 */
export type CellFormatType = 'text' | 'currency' | 'percentage' | 'date'

/**
 * 지역별 통화 및 날짜 형식을 지정하기 위한 지역 코드입니다.
 * - 'kr': 대한민국
 * - 'us': 미국
 * - 'jp': 일본
 * - 'cn': 중국
 * - 'eu': 유럽 연합 (독일 기준)
 */
export type Region = 'kr' | 'us' | 'jp' | 'cn' | 'eu'

/**
 * 셀 포맷팅에 사용될 옵션을 정의하는 인터페이스입니다.
 * @template T - 데이터 객체의 타입을 나타냅니다.
 */
export interface CellFormatOptions<T> {
    /**
     * 데이터 객체에서 값을 가져올 키를 지정합니다.
     */
    key: keyof T
    /**
     * 셀 내용의 정렬 방향을 지정합니다. (기본값: 'left')
     */
    align?: CellAlign
    /**
     * 셀 값의 포맷 유형을 지정합니다. (기본값: 'text')
     */
    format?: CellFormatType
    /**
     * 통화 및 날짜 형식에 사용할 지역을 지정합니다. (기본값: 'kr')
     */
    region?: Region
    /**
     * 값 앞에 추가할 접두사입니다.
     */
    prefix?: string
    /**
     * 값 뒤에 추가할 접미사입니다.
     */
    suffix?: string
    /**
     * 기본 포맷 대신 사용할 사용자 정의 렌더링 함수입니다.
     * @param value - 현재 셀의 값
     * @param row - 현재 행의 전체 데이터 객체
     * @returns 렌더링할 React 노드
     */
    customCell?: (value: T[keyof T], row: T) => React.ReactNode
}
