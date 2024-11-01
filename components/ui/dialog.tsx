import React, { useState } from 'react'

interface DialogProps {
  children: React.ReactNode
}

export function Dialog({ children }: DialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  // 将 children 分为 trigger 和其他内容
  const trigger = React.Children.toArray(children).find(
    child => React.isValidElement(child) && child.type === DialogTrigger
  )
  const content = React.Children.toArray(children).filter(
    child => React.isValidElement(child) && child.type !== DialogTrigger
  )

  return (
    <>
      {React.cloneElement(trigger as React.ReactElement, {
        onClick: () => setIsOpen(true)
      })}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6">
            {content}
            <button onClick={() => setIsOpen(false)} className="mt-4 px-4 py-2 bg-gray-200 rounded">
              关闭
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export function DialogTrigger({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function DialogContent({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="text-lg font-bold mb-2">{children}</div>
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold mb-4">{children}</h2>
}