import React from 'react'

interface TableProps {
  className?: string
  children: React.ReactNode
}

export function Table({ className = '', children }: TableProps) {
  return <table className={`min-w-full divide-y divide-gray-200 ${className}`}>{children}</table>
}

export function TableHeader({ className = '', children }: TableProps) {
  return <thead className={`bg-gray-50 ${className}`}>{children}</thead>
}

export function TableBody({ className = '', children }: TableProps) {
  return <tbody className={`bg-white divide-y divide-gray-200 ${className}`}>{children}</tbody>
}

export function TableRow({ className = '', children }: TableProps) {
  return <tr className={className}>{children}</tr>
}

export function TableHead({ className = '', children }: TableProps) {
  return <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>{children}</th>
}

export function TableCell({ className = '', children }: TableProps) {
  return <td className={`px-6 py-4 whitespace-nowrap ${className}`}>{children}</td>
}