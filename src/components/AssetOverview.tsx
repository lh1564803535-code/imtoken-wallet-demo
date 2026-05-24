import { useState, useEffect } from "react";
import type { ChainAddress } from "@/lib/tcx";

interface AssetOverviewProps {
  chainAddresses: ChainAddress[];
  onNavigate: (tab: string) => void;
}

export function AssetOverview({ chainAddresses, onNavigate }: AssetOverviewProps) {
  const [totalBalance, setTotalBalance] = useState<string>("$0.00");
  const [change24h, setChange24h] = useState<string>("+0.00%");

  // 模拟余额数据（后续替换为真实数据）
  useEffect(() => {
    if (chainAddresses.length > 0) {
      // 这里应该调用真实的余额查询API
      // 现在用模拟数据
      const mockBalance = "$12,345.67";
      setTotalBalance(mockBalance);
      setChange24h("+2.34%");
    }
  }, [chainAddresses]);

  return (
    <div className="p-4 pb-20">
      {/* 总资产大数字 */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold">{totalBalance}</h1>
        <p className="text-green-500 text-sm">{change24h} (24h)</p>
      </div>

      {/* 资产列表 */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">资产</h2>
        
        {/* ETH */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">ETH</span>
            </div>
            <div>
              <p className="font-medium">Ethereum</p>
              <p className="text-sm text-gray-500">0.5 ETH</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">$2,345.67</p>
            <p className="text-sm text-green-500">+1.23%</p>
          </div>
        </div>

        {/* BTC */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">BTC</span>
            </div>
            <div>
              <p className="font-medium">Bitcoin</p>
              <p className="text-sm text-gray-500">0.001 BTC</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">$10,000.00</p>
            <p className="text-sm text-green-500">+0.89%</p>
          </div>
        </div>

        {/* TRX */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">TRX</span>
            </div>
            <div>
              <p className="font-medium">Tron</p>
              <p className="text-sm text-gray-500">500 TRX</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">$100.00</p>
            <p className="text-sm text-red-500">-0.56%</p>
          </div>
        </div>
      </div>

      {/* 快捷操作按钮 */}
      <div className="flex space-x-3 mt-6">
        <button 
          onClick={() => onNavigate("send")}
          className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium"
        >
          发送
        </button>
        <button 
          onClick={() => onNavigate("receive")}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium"
        >
          接收
        </button>
      </div>
    </div>
  );
}
