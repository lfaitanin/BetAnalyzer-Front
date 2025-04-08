'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, TrendingUp, Shield, BarChart2 } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-blue-600">BasketBet Pro</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-8">
                <Link href="#sobre" className="text-gray-700 hover:text-gray-900">Sobre nós</Link>
                <Link href="#planos" className="text-gray-700 hover:text-gray-900">Planos</Link>
                <Link href="#blog" className="text-gray-700 hover:text-gray-900">Blog</Link>
                <Link href="/login" className="text-blue-600 hover:text-blue-700">Entrar</Link>
                <Link 
                  href="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Cadastre-se
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-8">
              Invista no nosso
              projeto ambicioso e<br />
              tenha qualidade 
              nas suas apostas
            </h1>
            <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
              Obtenha análises rápidas e precisas em cada aposta. Todas as suas estatísticas,
              previsões e histórico são integrados automaticamente em cada decisão.
            </p>
            <div className="flex justify-center space-x-6">
              <Link 
                href="/cadastro" 
                className="bg-blue-600 text-white px-8 py-4 rounded-md text-lg font-semibold hover:bg-blue-700 flex items-center"
              >
                Comece agora <ArrowRight className="ml-2" />
              </Link>
              <Link 
                href="#planos" 
                className="border border-blue-600 text-blue-600 px-8 py-4 rounded-md text-lg font-semibold hover:bg-blue-50"
              >
                Ver planos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20" id="sobre">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-gray-700 font-bold text-center mb-16">Por que escolher o BasketBet Pro?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Análise Avançada</h3>
              <p className="text-gray-700">Algoritmos avançados de machine learning para previsões precisas.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Gestão de Risco</h3>
              <p className="text-gray-700">Sistema inteligente de gestão de bankroll e avaliação de riscos.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart2 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Estatísticas em Tempo Real</h3>
              <p className="text-gray-700">Acompanhe suas apostas e resultados em tempo real.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50" id="planos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-700">Planos e Preços</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plano Básico */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-gray-700">Básico</h3>
              <p className="text-4xl font-bold mb-6 text-gray-700">R$ 49<span className="text-lg text-gray-600">/mês</span></p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  <span>Acesso a nosso bot de Basquete</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  <span>Histórico de apostas</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  <span>Controle de bankroll</span>
                </li>
              </ul>
              <Link 
                href="/cadastro" 
                className="block text-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
              >
                Começar agora
              </Link>
            </div>

            {/* Plano Pro */}
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-blue-600 transform scale-105">
              <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold inline-block mb-4">MAIS POPULAR</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-700">Pro</h3>
              <p className="text-4xl font-bold mb-6 text-gray-700">R$ 99<span className="text-lg text-gray-600">/mês</span></p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  <span>Tudo do plano Básico</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  <span>Análises avançadas</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  <span>Alertas em tempo real</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  <span>Suporte prioritário</span>
                </li>
              </ul>
              <Link 
                href="/cadastro" 
                className="block text-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
              >
                Começar agora
              </Link>
            </div>

            {/* Plano Enterprise */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-gray-700">Enterprise</h3>
              <p className="text-4xl font-bold mb-6 text-gray-700">R$ 199<span className="text-lg text-gray-600">/mês</span></p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  <span>Tudo do plano Pro</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  <span>Acesso a todos os esportes</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  <span>Consultoria dedicada</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  <span>Relatórios personalizados</span>
                </li>
              </ul>
              <Link 
                href="/cadastro" 
                className="block text-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
              >
                Começar agora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20" id="blog">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-700">Blog</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Blog Post 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-700">Estratégias avançadas de apostas na NBA</h3>
                <p className="text-gray-700 mb-4">Aprenda as melhores estratégias para maximizar seus ganhos nas apostas da NBA.</p>
                <Link href="/blog/1" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Ler mais →
                </Link>
              </div>
            </div>

            {/* Blog Post 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-700">Análise estatística no basquete</h3>
                <p className="text-gray-700 mb-4">Como usar dados estatísticos para tomar melhores decisões em suas apostas.</p>
                <Link href="/blog/2" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Ler mais →
                </Link>
              </div>
            </div>

            {/* Blog Post 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-700">Gestão de bankroll</h3>
                <p className="text-gray-700 mb-4">Dicas essenciais para gerenciar seu bankroll e minimizar riscos.</p>
                <Link href="/blog/3" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Ler mais →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">BasketBet Pro</h4>
              <p className="text-gray-300">Sua plataforma de apostas inteligentes em basquete.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2">
                <li><Link href="#sobre" className="text-gray-300 hover:text-white">Sobre nós</Link></li>
                <li><Link href="#planos" className="text-gray-300 hover:text-white">Planos</Link></li>
                <li><Link href="#blog" className="text-gray-300 hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contato</h4>
              <ul className="space-y-2">
                <li className="text-gray-300">suporte@basketbetpro.com</li>
                <li className="text-gray-300">+55 (21) 99200-6250</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Redes Sociais</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-300">&copy; 2024 BasketBet Pro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}