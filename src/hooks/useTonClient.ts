import { TonClient } from "@ton/ton";
import { useAsyncInitialize } from './useAsyncInitialize.ts';
import { net } from '../const.tsx';
export function useTonClient() {
  return useAsyncInitialize(
    async () => {
      let endpoint, apiKey
      //@ts-ignore
      if (net === "test") {
        endpoint = "https://testnet.toncenter.com/api/v2/jsonRPC";
        apiKey = "b9b48c2b43be69e948b535bb090fe9d1e3e1d87fd001964f44d08d347deb51cd"
      } else {
        endpoint = "https://toncenter.com/api/v2/jsonRPC";
        apiKey = "6d06e87b73f8bb249af4b62c2ea0ae18d1eeb7256b9040541e072a8a12d82c8a";
      }
      return new TonClient({
        endpoint, apiKey,
      })
    }

  );
}
