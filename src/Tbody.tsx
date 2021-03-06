import * as React from 'react'
import { useRef, useEffect } from 'react'
import HTMLTbody from './HTMLTbody'
import { Context } from './context'

interface ITbodyProps extends React.HTMLAttributes<HTMLDivElement> {
    tr?: (args?: {
        row: any,
        rowIndex: number,
        cells: JSX.Element
    }) => JSX.Element
}

export default class Tbody extends React.Component<ITbodyProps, {}> {
    static contextType = Context
    static defaultProps = {
        onScroll: evt => { }
    }

    private _bodyWidth: number
    private _tableWidth: number
    private scrollLeft: number
    private bodyRef: React.RefObject<HTMLDivElement>
    private tableRef: React.RefObject<HTMLTableElement>
    private leftRef: React.RefObject<HTMLDivElement>
    private rightRef: React.RefObject<HTMLDivElement>
    private shadowLeft: boolean
    private shadowRight: boolean
    private time: any

    constructor(props) {
        super(props)
        this.scrollLeft = -1
        this.bodyRef
        this.tableRef = React.createRef()
        this.leftRef = React.createRef()
        this.rightRef = React.createRef()
        this.shadowLeft = false
        this.shadowRight = false
        this.time = new Date()
    }

    get bodyWidth() {
        return this._bodyWidth || (this._bodyWidth = this.bodyRef.current.offsetWidth)
    }

    get tableWidth() {
        return this._tableWidth || (this._tableWidth = this.tableRef.current.offsetWidth)
    }

    set bodyWidth(value) {
        this._bodyWidth = value
    }

    set tableWidth(value) {
        this._tableWidth = value
    }

    onScroll = evt => {
        this.shadow(evt.target.scrollLeft, evt.timeStamp)
        this.props.onScroll(evt)
    }

    shadow = (scrollLeft, current) => {
        if(this.scrollLeft === scrollLeft) return
        this.scrollLeft = scrollLeft

        current - this.time > 2000 ? this.reset() : undefined
        this.time = current

        const scrollRight = this.tableWidth - scrollLeft - this.bodyWidth

        if (scrollLeft == 0) {
            this.shadowLeft ? this.leftRef.current.classList.remove('designare-shadow') : undefined
            this.shadowLeft = false
        } else {
            this.shadowLeft ? undefined : this.leftRef.current.classList.add('designare-shadow')
            this.shadowLeft = true
        }
        if (scrollRight <= 0) {
            this.shadowRight ? this.rightRef.current.classList.remove('designare-shadow') : undefined
            this.shadowRight = false
        } else {
            this.shadowRight ? undefined : this.rightRef.current.classList.add('designare-shadow')
            this.shadowRight = true
        }
    }

    reset = () => {
        this.tableWidth = undefined
        this.bodyWidth = undefined
    }

    componentDidUpdate() {
        this.shadow(this.bodyRef.current.scrollLeft, new Date())
    }

    render() {
        const { isInit, syncScrolling, removeSyncScrolling } = this.context
        const { className = '', tr, style, onScroll, ...restProps } = this.props
        return (
            <div
                className={`designare-table-fixed-body animate ${className}`}
                style={{ flex: '1 1 auto', position: 'relative', overflow: 'hidden', opacity: isInit() ? 1 : 0, ...style }}
                {...restProps}
            >
                <Left
                    leftRef={this.leftRef}
                    syncScrolling={syncScrolling}
                    removeSyncScrolling={removeSyncScrolling}
                >
                    <HTMLTbody fixed='left' tr={tr} />
                </Left>
                <Normal
                    deliverBodyRef={ref => this.bodyRef = ref}
                    tableRef={this.tableRef}
                    syncScrolling={syncScrolling}
                    removeSyncScrolling={removeSyncScrolling}
                    onScroll={this.onScroll}
                >
                    <HTMLTbody tr={tr} />
                </Normal>
                <Right
                    rightRef={this.rightRef}
                    syncScrolling={syncScrolling}
                    removeSyncScrolling={removeSyncScrolling}
                >
                    <HTMLTbody fixed='right' tr={tr} />
                </Right>
            </div>
        )
    }
}

function Normal(props) {
    const ref = useRef(null)
    const { syncScrolling, removeSyncScrolling, onScroll, tableRef, deliverBodyRef } = props
    useEffect(() => {
        deliverBodyRef(ref)
        syncScrolling(ref.current, 'both')
        return () => { removeSyncScrolling(ref.current) }
    }, [])

    return (
        <div
            ref={ref}
            className='designare-table-body'
            style={{ width: '100%', height: '100%', overflow: 'auto' }}
            onScroll={onScroll}
        >
            <table ref={tableRef}>
                {props.children}
            </table>
        </div>
    )
}

function Left(props) {
    const ref = useRef(null)
    const { syncScrolling, removeSyncScrolling, leftRef } = props
    useEffect(() => {
        syncScrolling(ref.current, 'scrollTop')
        return () => { removeSyncScrolling(ref.current) }
    }, [])
    return (
        <div
            ref={leftRef}
            className='designare-table-body-left'
        >
            <div ref={ref} style={{ height: '100%', overflowY: 'auto', backgroundColor: 'inherit' }}>
                <table>
                    {props.children}
                </table>
            </div>
        </div>
    )
}

function Right(props) {
    const ref = useRef(null)
    const { syncScrolling, removeSyncScrolling, rightRef } = props
    useEffect(() => {
        syncScrolling(ref.current, 'scrollTop')
        return () => { removeSyncScrolling(ref.current) }
    }, [])
    return (
        <div
            ref={rightRef}
            className='designare-table-body-right'
        >
            <div ref={ref} style={{ height: '100%', overflowY: 'auto', backgroundColor: 'inherit' }}>
                <table>
                    {props.children}
                </table>
            </div>
        </div>
    )
}