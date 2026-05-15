import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { saveDadosEmpresa, type DadosEmpresa } from '@/services/dados_empresa'
import { Loader2 } from 'lucide-react'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: DadosEmpresa | null
  onSave: (data: DadosEmpresa) => void
}

export function CompanyProfileModal({ open, onOpenChange, initialData, onSave }: Props) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    razao_social: '',
    cnpj: '',
    endereco_completo: '',
    cidade_estado: '',
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)

  useEffect(() => {
    if (initialData) {
      setFormData({
        razao_social: initialData.razao_social || '',
        cnpj: initialData.cnpj || '',
        endereco_completo: initialData.endereco_completo || '',
        cidade_estado: initialData.cidade_estado || '',
      })
      setLogoFile(null)
    }
  }, [initialData, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = new FormData()
      data.append('razao_social', formData.razao_social)
      data.append('cnpj', formData.cnpj)
      data.append('endereco_completo', formData.endereco_completo)
      data.append('cidade_estado', formData.cidade_estado)
      if (logoFile) {
        data.append('logotipo', logoFile)
      }

      const saved = await saveDadosEmpresa(data, initialData?.id)
      onSave(saved)
      toast({
        title: 'Perfil salvo!',
        description: 'Os dados da sua empresa foram atualizados com sucesso.',
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        description: 'Verifique os dados e tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCnpj = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Perfil da Empresa</DialogTitle>
          <DialogDescription>
            Preencha os dados da sua empresa para personalizar seus documentos jurídicos.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="razao_social">Razão Social</Label>
            <Input
              id="razao_social"
              required
              value={formData.razao_social}
              onChange={(e) => setFormData((f) => ({ ...f, razao_social: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input
              id="cnpj"
              required
              value={formData.cnpj}
              onChange={(e) => setFormData((f) => ({ ...f, cnpj: formatCnpj(e.target.value) }))}
              placeholder="00.000.000/0000-00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endereco_completo">Endereço Completo</Label>
            <Textarea
              id="endereco_completo"
              required
              value={formData.endereco_completo}
              onChange={(e) => setFormData((f) => ({ ...f, endereco_completo: e.target.value }))}
              placeholder="Rua, Número, Bairro, CEP"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cidade_estado">Cidade / Estado</Label>
            <Input
              id="cidade_estado"
              required
              value={formData.cidade_estado}
              onChange={(e) => setFormData((f) => ({ ...f, cidade_estado: e.target.value }))}
              placeholder="São Paulo / SP"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logotipo">Logotipo (Opcional)</Label>
            <Input
              id="logotipo"
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
            />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="min-h-[44px]"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[120px] min-h-[44px]">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Salvar Dados'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
