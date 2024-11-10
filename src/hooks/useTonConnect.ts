import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { Sender, SenderArguments } from '@ton/core';
//@ts-ignore
export function useTonConnect(): { sender: Sender; connected: boolean, wallet: any } {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  return {
    sender: {
      send: async (args: SenderArguments) => {
        tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString('base64'),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        });
      },
    },
    connected: tonConnectUI.connected,
    wallet

  };
}
