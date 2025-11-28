import {useAccount, useDisconnect} from 'wagmi'

export function WalletButton(){
    const {address, isConnected} = useAccount()
    const {disconnect} = useDisconnect()

    const handleConnect = () => {
        import('../config/web3').then(({ web3Modal }) => {
            web3Modal.open()
        })
    }

    if(isConnected && address) {
        return(
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => disconnect()}
                    className="px-5 py-2.5 bg-black hover:bg-gray-50 border border-gray-200/50 text-white font-mono text-sm rounded-xl transition-all duration-200 shadow-sm hover:shadow-md font-semibold"
                >
                    Disconnect
                </button>
            </div>
        )
    }

    return (
        <button 
            onClick={handleConnect} 
            className="px-6 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-gray-900/20 hover:shadow-xl transform hover:scale-[1.05] active:scale-[0.95]"
        >
            Connect Wallet
        </button>
    )
}