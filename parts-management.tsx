"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import QRCode from "react-qr-code"
import { QrReader } from "react-qr-reader"

interface Part {
  id: number
  name: string
  quantity: number
}

interface PartsManagementProps {
  onLogout: () => void
}

export default function PartsManagement({ onLogout }: PartsManagementProps) {
  const [parts, setParts] = useState<Part[]>([
    { id: 1, name: "螺丝", quantity: 100 },
    { id: 2, name: "螺母", quantity: 50 },
    { id: 3, name: "垫圈", quantity: 75 },
  ])
  const [newPart, setNewPart] = useState({ name: "", quantity: 0 })
  const [selectedPart, setSelectedPart] = useState<Part | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false)
  const [isScannerDialogOpen, setIsScannerDialogOpen] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)

  const handleAddPart = () => {
    if (newPart.name && newPart.quantity > 0) {
      setParts([...parts, { id: parts.length + 1, ...newPart }])
      setNewPart({ name: "", quantity: 0 })
      setIsAddDialogOpen(false)
    }
  }

  const handleQuantityChange = (id: number, change: number) => {
    setParts(
      parts.map((part) =>
        part.id === id ? { ...part, quantity: Math.max(0, part.quantity + change) } : part
      )
    )
  }

  const handleScan = (result: string | null) => {
    if (result) {
      setScanResult(result)
      try {
        const scannedPart = JSON.parse(result) as Part
        const existingPartIndex = parts.findIndex(part => part.id === scannedPart.id)
        if (existingPartIndex !== -1) {
          // Update existing part
          setParts(parts.map((part, index) => 
            index === existingPartIndex ? { ...part, quantity: part.quantity + 1 } : part
          ))
        } else {
          // Add new part
          setParts([...parts, { ...scannedPart, quantity: 1 }])
        }
        setIsScannerDialogOpen(false)
      } catch (error) {
        console.error("Invalid QR code data", error)
      }
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">零件管理系统</h1>
        <Button onClick={onLogout}>登出</Button>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>添加新零件</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>添加新零件</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  名称
                </Label>
                <Input
                  id="name"
                  value={newPart.name}
                  onChange={(e) => setNewPart({ ...newPart, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  数量
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newPart.quantity}
                  onChange={(e) => setNewPart({ ...newPart, quantity: parseInt(e.target.value) })}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleAddPart}>添加</Button>
          </DialogContent>
        </Dialog>
        <Dialog open={isScannerDialogOpen} onOpenChange={setIsScannerDialogOpen}>
          <DialogTrigger asChild>
            <Button>扫描二维码</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>扫描零件二维码</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <QrReader
                onResult={(result) => {
                  if (result) {
                    handleScan(result.getText());
                  }
                }}
                constraints={{ facingMode: 'environment' }}
                className="w-full"
              />
            </div>
            {scanResult && <p className="text-sm">扫描结果: {scanResult}</p>}
          </DialogContent>
        </Dialog>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>名称</TableHead>
              <TableHead>数量</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parts.map((part) => (
              <TableRow key={part.id}>
                <TableCell className="font-medium">{part.id}</TableCell>
                <TableCell>{part.name}</TableCell>
                <TableCell>{part.quantity}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button size="sm" onClick={() => handleQuantityChange(part.id, 1)}>
                      入库
                    </Button>
                    <Button size="sm" onClick={() => handleQuantityChange(part.id, -1)}>
                      出库
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedPart(part)
                        setIsQRDialogOpen(true)
                      }}
                    >
                      二维码
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedPart?.name} 的二维码</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-4">
            {selectedPart && (
              <QRCode
                value={JSON.stringify(selectedPart)}
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox={`0 0 256 256`}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}