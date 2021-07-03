import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import classnames from 'classnames'
import { getScroller, noop } from '../utils'
import './index.less'

export type TreeNode = {
  label: string
  value: string | number
  level?: number
  checked?: boolean
  parent?: string | number
  disabled?: boolean
  children?: TreeNode[]
}

export type TreeSelectValue = string | number | (string | number)[]

export type TreeSelectProps = Readonly<
  {
    value?: TreeSelectValue
    className?: string
    style?: React.CSSProperties
  } & Partial<typeof defaultProps>
>

export type TreeSelectRef = {
  getCheckedKeys: () => TreeSelectValue
  getCheckedNodes: () => TreeNode[]
}

const defaultProps = {
  data: [] as TreeNode[],
  defaultValue: '' as TreeSelectValue,
  defaultExpandKeys: [] as (string | number)[],
  columnStyles: [] as React.CSSProperties[],
  columnClassPrefix: 'tree-select-column',
  activeCellClassName: 'tree-select-cell-active',
  onSelect: noop as (node: TreeNode) => void,
  onChange: noop as (value: TreeSelectValue) => void,
}

/**
 * 转换树形结构数据
 */
function transformData(
  data: TreeNode[],
  value: TreeSelectValue,
  level = 0,
  parent = null as string | number,
): TreeNode[] {
  return data.map(node => {
    const checked = Array.isArray(value)
      ? value.includes(node.value)
      : value === node.value
    const children =
      Array.isArray(node.children) && node.children.length
        ? transformData(node.children, value, level + 1, node.value)
        : null

    return { ...node, level, checked, parent, children }
  })
}

/**
 * 树结构扁平化
 */
function flattenTree(data: TreeNode[]): TreeNode[] {
  return data.reduce(
    (prev: TreeNode[], cur: TreeNode) =>
      cur.children
        ? [...prev, cur, ...flattenTree(cur.children)]
        : [...prev, cur],
    [],
  )
}

/**
 * 根据所传键值找出其所有父节点
 */
function getParentNodes(data: TreeNode[], value: TreeSelectValue): TreeNode[] {
  const flatTreeData = flattenTree(data)

  const findParents = (value: string | number) => {
    const targetNode = flatTreeData.find(node => node.value === value)
    if (!targetNode) return []

    const parentNodes: TreeNode[] = []
    let parent = targetNode.parent

    while (parent) {
      const parentNode = flatTreeData.find(node => node.value === parent)
      if (parentNode.disabled) return []
      parentNodes.push(parentNode)
      parent = parentNode.parent
    }
    return parentNodes
  }

  if (Array.isArray(value)) {
    let parentNodes = []
    let index = 0

    while (!parentNodes.length && index < value.length) {
      parentNodes = findParents(value[index++])
    }
    return parentNodes
  } else {
    return findParents(value)
  }
}

/**
 * 获取所有选中节点
 */
function getCheckedNodes(data: TreeNode[]): TreeNode[] {
  if (!data.length) return []

  const checkedNodes: TreeNode[] = []
  const stack: TreeNode[] = []

  for (let i = data.length - 1; i >= 0; i--) {
    stack.push(data[i])
  }

  while (stack.length) {
    const current = stack.pop()
    const children = current.children

    current.checked && checkedNodes.push(current)

    if (Array.isArray(children)) {
      for (let j = children.length - 1; j >= 0; j--) {
        stack.push(children[j])
      }
    }
  }

  return checkedNodes
}

const TreeSelect = React.forwardRef<TreeSelectRef, TreeSelectProps>(
  (props, ref) => {
    const {
      data,
      defaultValue,
      value,
      defaultExpandKeys,
      columnStyles,
      columnClassPrefix,
      activeCellClassName,
      onChange,
      onSelect,
      className,
      style,
    } = props

    const treeSelectRef = useRef<HTMLDivElement>(null)
    const hasInitExpandKeysRef = useRef(false)
    const [expandKeys, setExpandKeys] = useState(defaultExpandKeys)
    const [selfValue, setSelfValue] = useState(defaultValue)

    const finalValue = useMemo(
      () => (value !== undefined ? value : selfValue),
      [value, selfValue],
    )
    const dataSource = useMemo(() => transformData(data, finalValue), [
      data,
      finalValue,
    ])

    const compClsPrefix = 'react-app-ui-tree-select'
    const compClsName = classnames(compClsPrefix, className)

    const getCellCls = (node: TreeNode) => {
      let isChecked = false

      if (Array.isArray(node.children)) {
        isChecked = expandKeys[node.level] === node.value
      } else {
        isChecked = Array.isArray(finalValue)
          ? finalValue.includes(node.value)
          : finalValue === node.value
      }

      return classnames(`${compClsPrefix}-cell`, {
        [`${compClsPrefix}-cell--disabled`]: node.disabled,
        [activeCellClassName]: isChecked,
      })
    }

    const renderColumn = (data: TreeNode[], level: number) => (
      <ul
        key={`column-${level}`}
        style={columnStyles[level] || {}}
        className={classnames(
          `${compClsPrefix}-column`,
          `${columnClassPrefix}__${level}`,
        )}
      >
        {data.map(node => (
          <li
            key={`cell-${level}-${node.value}`}
            className={getCellCls(node)}
            onClick={onCellClick.bind(null, node)}
          >
            {node.label}
          </li>
        ))}
      </ul>
    )

    const renderTree = () => {
      const flatTreeData = flattenTree(dataSource)

      return [renderColumn(dataSource, 0)].concat(
        expandKeys.map((cur: string | number, index) => {
          const target = flatTreeData.find(
            node => node.value === cur && node.level === index,
          )
          return target?.children
            ? renderColumn(target.children, target.level + 1)
            : null
        }),
      )
    }

    const onCellClick = (node: TreeNode) => {
      if (node.disabled) return

      if (Array.isArray(node.children)) {
        setExpandKeys(value => {
          return [...value.slice(0, node.level), node.value]
        })
      } else {
        let changeValue: TreeSelectValue = null

        if (Array.isArray(finalValue)) {
          changeValue = finalValue.includes(node.value)
            ? (finalValue as string[]).filter(value => value !== node.value)
            : [...finalValue, node.value]
        } else {
          changeValue = node.value
        }

        setSelfValue(changeValue)
        onSelect(node)
        onChange(changeValue)
      }
    }

    useEffect(() => {
      if (
        !hasInitExpandKeysRef.current &&
        !expandKeys.length &&
        dataSource.length
      ) {
        const parentNodes = getParentNodes(dataSource, finalValue)
        const expandKeys = parentNodes.map(node => node.value).reverse()

        if (!expandKeys.length) {
          expandKeys.push(dataSource[0].value)
        }
        setExpandKeys(expandKeys)

        Promise.resolve().then(() => {
          if (treeSelectRef.current) {
            const activeElements =
              treeSelectRef.current.querySelectorAll(
                `.${activeCellClassName}`,
              ) ?? []
            ;([...activeElements] as HTMLElement[]).forEach(element => {
              getScroller(element)?.scrollTo(0, element.offsetTop)
            })
          }
        })

        hasInitExpandKeysRef.current = true
      }
    }, [expandKeys, dataSource, finalValue, activeCellClassName])

    useImperativeHandle(ref, () => ({
      getCheckedKeys: () => finalValue,
      getCheckedNodes: () => getCheckedNodes(dataSource),
    }))

    return (
      <div className={compClsName} style={style} ref={treeSelectRef}>
        {renderTree()}
      </div>
    )
  },
)

TreeSelect.defaultProps = defaultProps

export default TreeSelect
