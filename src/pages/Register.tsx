import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import logoImg from '@/assets/logounificadocomtexto-5fbfd.png'

export default function Register() {
  const { signUp, user } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true })
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (password.length < 6) {
      setErrorMsg('A senha deve ter no mínimo 6 caracteres')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('Senhas não conferem')
      return
    }

    setLoading(true)
    const { error } = await signUp({ email, password, name })
    setLoading(false)

    if (error) {
      setErrorMsg('Usuário já existe')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: `url(${logoImg})` }}
      />
      <div className="absolute inset-0 z-0 bg-background/60 backdrop-blur-sm" />

      <Card className="w-full max-w-sm animate-fade-in relative z-10 border-primary/20 shadow-2xl shadow-primary/5">
        <CardHeader className="space-y-4 pb-6 flex flex-col items-center text-center">
          <img
            src={logoImg}
            alt="Mentoria DTS Bônus"
            className="w-24 h-auto object-contain animate-slide-up"
          />
          <div className="space-y-2 w-full">
            <CardTitle className="text-2xl font-bold text-primary">Cadastro</CardTitle>
            <CardDescription className="text-base font-normal text-foreground">
              Crie sua conta para acessar os bônus exclusivos.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-label="Nome"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Senha"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-label="Confirmar Senha"
              />
            </div>

            {errorMsg && (
              <p className="text-sm font-medium text-destructive text-center animate-fade-in">
                {errorMsg}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cadastrar
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground text-center w-full">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Faça Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
