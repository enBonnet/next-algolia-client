import algoliasearch, {
  SearchIndex,
  AlgoliaSearchOptions,
} from "algoliasearch/lite";

interface AlgoliaServerConfig {
  algoliaPublicId: string;
  algoliaPublicKey: string;
  options?: AlgoliaSearchOptions;
}

export default class AlgoliaClient {
  protected static instance: AlgoliaClient | null = null;
  private algoliaPublicId: string = "";
  private algoliaPublicKey: string = "";
  private options?: AlgoliaSearchOptions | undefined = undefined;
  private clientIndex?: SearchIndex = undefined;

  constructor(config: AlgoliaServerConfig) {
    this.algoliaPublicId = config.algoliaPublicId;
    this.algoliaPublicKey = config.algoliaPublicKey;
    this.options = config.options;
  }

  public static getInstance = (config: AlgoliaServerConfig): AlgoliaClient => {
    if (!AlgoliaClient.instance) {
      AlgoliaClient.instance = new AlgoliaClient(config);
    }

    return AlgoliaClient.instance;
  };

  public setIndex = (indexName: string) => {
    const client = algoliasearch(
      this.algoliaPublicId,
      this.algoliaPublicKey,
      this.options
    );
    this.clientIndex = client.initIndex(indexName);
  };

  public search = (query: string) => {
    return new Promise((resolve, reject) => {
      if (!this.clientIndex) throw new Error("Client index is not defined");
      this.clientIndex
        .search(query)
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  };
}
