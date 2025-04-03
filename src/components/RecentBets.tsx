interface Bet {
  id: string;
  player: string;
  category: string;
  target: number;
  result: number;
  status: 'win' | 'loss';
  date: string;
}

export function RecentBets() {
  const recentBets: Bet[] = [
    {
      id: '1',
      player: 'LeBron James',
      category: 'Pontos',
      target: 25.5,
      result: 28,
      status: 'win',
      date: '2024-04-01'
    },
    // Adicionar mais apostas aqui
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Jogador</th>
            <th className="text-left py-2">Categoria</th>
            <th className="text-left py-2">Meta</th>
            <th className="text-left py-2">Resultado</th>
            <th className="text-left py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {recentBets.map((bet) => (
            <tr key={bet.id} className="border-b">
              <td className="py-2">{bet.player}</td>
              <td className="py-2">{bet.category}</td>
              <td className="py-2">{bet.target}</td>
              <td className="py-2">{bet.result}</td>
              <td className="py-2">
                <span className={`px-2 py-1 rounded-full text-sm ${
                  bet.status === 'win' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {bet.status === 'win' ? 'Ganhou' : 'Perdeu'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
