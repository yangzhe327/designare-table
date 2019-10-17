import React, { useState } from 'react'
import Table, { Header, Body, Tds, Ths, Th, Td, Sorter } from '../index'
import { data } from '../data/one'


export default function Six(props) {

    const [selectAll, setSelectAll] = useState(false)
    const [selectedKeys, setSelectedKeys] = useState([])
    const [ sorter, setSorter ] = useState({key:'percent', direction:'asc'})

    const onToggleAll = (evt) => {
        const checked = evt.target.checked
        setSelectAll(checked)
        if (!checked) {
            setSelectedKeys([])
        }
    }

    const onToggle = (evt, index) => {
        const s = new Set(selectedKeys)
        if (evt.target.checked) {
            s.add(index)
        } else {
            s.delete(index)
        }
        setSelectedKeys([...s])
    }

    return (
        <div style={{ margin: 'auto' }}>
            <Table
                selectedKeys={selectedKeys}
                selectAll={selectAll}
                style={{ width: '80%' }}
                columns={[
                    {
                        Header: ({ value, row, selectAll }) => {
                            const checked = selectAll
                            return (
                                <Th>
                                    <input type='checkbox' onChange={onToggleAll} checked={checked} />
                                </Th>
                            )
                        },
                        key: '',
                        Cell: ({ value, row, index, selectedKeys, selectAll }) => {
                            const checked = selectedKeys.includes(index) || selectAll
                            return <Td style={{textAlign:'center'}}><input type='checkbox' onChange={evt => onToggle(evt, index)} checked={checked} /></Td>
                        }
                    },
                    {
                        Header: ({ index }) => {
                            return (
                                <Th>
                                    <span style={{ display: 'table-cell' }}>Name</span>
                                    <Sorter />
                                </Th>
                            )
                        },
                        key: 'name',
                    },
                    {
                        Header: ({ index }) => {
                            return (
                                <Th>
                                    <span style={{ display: 'table-cell' }}>PREV.CLOSE</span>
                                    <Sorter directions={['asc', 'des']} by='number' />
                                </Th>
                            )
                        },
                        key: 'prev_close',
                    },
                    {
                        Header: ({ index }) => {
                            return (
                                <Th>
                                    <span style={{ display: 'table-cell' }}>+/-</span>
                                    <Sorter directions={['des', 'asc']} by='number'/>
                                </Th>
                            )
                        },
                        key: 'percent'
                    },
                    {
                        Header: ({ index }) => {
                            return (
                                <Th>
                                    <span style={{ display: 'table-cell' }}>Time</span>
                                    <Sorter directions={['des']} />
                                </Th>
                            )
                        },
                        key: 'time'
                    },
                    {
                        Header: 'Month',
                        children: [
                            {
                                Header: '3 MO',
                                key: 'three_month'
                            },
                            {
                                Header: '6 MO',
                                key: 'six_month'
                            }
                        ]
                    },
                    {
                        Header: 'YTD',
                        key: 'ytd',
                    },
                    {
                        Header: ({ index }) => {
                            return (
                                <Th>
                                    <span style={{ display: 'table-cell' }}>Tag</span>
                                    <Sorter directions={['asc', 'des']} by='number'/>
                                </Th>
                            )
                        },
                        key: 'percent',
                        Cell: ({ value }) => <Td><span style={{ color: value.includes('-') ? 'red' : 'green' }}>{value}</span></Td>
                    }
                ]}
                data={data}
                sorter={sorter}
                onChangeSorter={({ key, direction}) => {
                    // console.log(`key`, key, ' direction',direction)
                    setSorter({key, direction})

                    console.log(`key`,key, 'direction',direction)
                }}
            >
                <Header
                />
                <Body
                />
            </Table>
        </div>
    )
}
