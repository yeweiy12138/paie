"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card"
import { Label } from "./ui/label"
import QRCode from "react-qr-code"
import QRScanner from "./QRScanner"

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

  const handleAddPart = () => {
    if (newPart.name && newPart.quantity > 0) {
      setParts([...parts, { id: parts.length + 1, ...newPart }])
      setNewPart({ name: "", quantity: 0 })
    }
  }

  const handleQuantityChange = (id: number, change: number) => {
    setParts(
      parts.map((part) =>
        part.id === id ? { ...part, quantity: Math.max(0, part.quantity + change) } : part
      )
    )
  }

  const handleScan = (result: string) => {
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
    } catch (error) {
      console.error("Invalid QR code data", error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>零件管理系统</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger>
                  <Button>添加新零件</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>添加新零件</DialogTitle>
                  </DialogHeader>
                  <div className="mb-4">
                    <Label htmlFor="name">名称</Label>
                    <Input
                      id="name"
                      value={newPart.name}
                      onChange={(e) => setNewPart({ ...newPart, name: e.target.value })}
                    />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="quantity">数量</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newPart.quantity}
                      onChange={(e) => setNewPart({ ...newPart, quantity: parseInt(e.target.value) })}
                    />
                  </div>
                  <Button onClick={handleAddPart}>添加</Button>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger>
                  <Button>扫描二维码</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>扫描零件二维码</DialogTitle>
                  </DialogHeader>
                  <QRScanner onScan={handleScan} />
                </DialogContent>
              </Dialog>
            </div>
            <Button onClick={onLogout}>登出</Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>名称</TableHead>
                  <TableHead>数量</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parts.map((part) => (
                  <TableRow key={part.id}>
                    <TableCell>{part.id}</TableCell>
                    <TableCell>{part.name}</TableCell>
                    <TableCell>{part.quantity}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button onClick={() => handleQuantityChange(part.id, 1)}>入库</Button>
                        <Button onClick={() => handleQuantityChange(part.id, -1)}>出库</Button>
                        <Dialog>
                          <DialogTrigger>
                            <Button>二维码</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{part.name} 的二维码</DialogTitle>
                            </DialogHeader>
                            <div className="flex justify-center py-4">
                              <QRCode
                                value={JSON.stringify(part)}
                                size={256}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                viewBox={`0 0 256 256`}
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}