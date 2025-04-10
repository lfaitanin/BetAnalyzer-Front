'use client';
 
import { useState } from 'react';
import { getBetHistory, BetHistory, BetHistoryFilters } from '@/services/api';
import BetsFilter from '@/components/BetsFilter';
 
 export default function PontosPage() {
   const [bets, setBets] = useState<BetHistory[]>([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
 
   const loadBets = async (filters: BetHistoryFilters) => {
     try {
       setLoading(true);
       const data = await getBetHistory({
         ...filters,
         category: 'Points'
       });
       setBets(data);
       setError(null);
     } catch (err) {
       setError('Erro ao carregar histórico de apostas');
       console.error(err);
     } finally {
       setLoading(false);
     }
   };
 
   const handleFilterChange = (filters: BetHistoryFilters) => {
     loadBets(filters);
   };
 
   if (loading) {
     return (
       <div className="flex items-center justify-center min-h-screen">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
       </div>
     );
   }
 
   if (error) {
     return (
       <div className="p-4 bg-red-50 text-red-800 rounded-lg">
         {error}
       </div>
     );
   }
 
   return (
     <div className="space-y-4 md:space-y-6 p-2 md:p-6 bg-gray-50">
       <h1 className="text-xl md:text-2xl font-bold text-gray-900">Apostas em Pontos</h1>
       
       <BetsFilter onFilterChange={handleFilterChange} />
       
       <div className="bg-white rounded-lg shadow-md overflow-hidden">
         <div className="overflow-x-auto">
           <table className="min-w-full divide-y divide-gray-200">
             <thead className="bg-gray-50">
               <tr>
                 <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                 <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jogador</th>
                 <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                 <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meta</th>
                 <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resultado</th>
                 <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Odds</th>
                 <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stake</th>
                 <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lucro</th>
                 <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
               </tr>
             </thead>
             <tbody className="bg-white divide-y divide-gray-200">
               {bets.map((bet, index) => (
                 <tr key={index} className="hover:bg-gray-50">
                   <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                     {new Date(bet.date).toLocaleDateString('pt-BR')}
                   </td>
                   <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">{bet.playerName}</td>
                   <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">{bet.team}</td>
                   <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">{bet.target}</td>
                   <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">{bet.result}</td>
                   <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">{bet.odds}</td>
                   <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">R$ {bet.stake}</td>
                   <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">R$ {bet.profit}</td>
                   <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                     <span className={`px-2 py-1 text-xs rounded-full ${
                       bet.status === 'Ganhou' 
                         ? 'bg-green-100 text-green-800' 
                         : 'bg-red-100 text-red-800'
                     }`}>
                       {bet.status}
                     </span>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       </div>
     </div>
   );
 } 