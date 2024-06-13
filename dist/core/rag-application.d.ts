import { AddLoaderReturn, Chunk, ConversationEntry } from '../global/types.js';
import { LoaderParam } from './dynamic-loader-selector.js';
import { RAGApplicationBuilder } from './rag-application-builder.js';
export declare class RAGApplication {
    private readonly debug;
    private readonly queryTemplate;
    private readonly searchResultCount;
    private readonly cache?;
    private readonly vectorDb;
    private readonly model;
    private readonly embeddingRelevanceCutOff;
    private readonly rawLoaders;
    private loaders;
    private readonly conversations;
    constructor(llmBuilder: RAGApplicationBuilder);
    /**
     * The function `embedChunks` embeds the content of chunks by invoking the planned embedding model.
     * @param {Pick<Chunk, 'pageContent'>[]} chunks - The `chunks` parameter is an array of objects
     * that have a property `pageContent` which contains text content for each chunk.
     * @returns The `embedChunks` function is returning the embedded vectors for the chunks.
     */
    private embedChunks;
    /**
     * The function `getChunkUniqueId` generates a unique identifier by combining a loader unique ID and
     * an increment ID.
     * @param {string} loaderUniqueId - A unique identifier for the loader.
     * @param {number} incrementId - The `incrementId` parameter is a number that represents the
     * increment value used to generate a unique chunk identifier.
     * @returns The function `getChunkUniqueId` returns a string that combines the `loaderUniqueId` and
     * `incrementId`.
     */
    private getChunkUniqueId;
    /**
     * This async function initializes various components such as loaders, model, vector database,
     * cache, and pre-loaders.
     */
    init(): Promise<void>;
    /**
     * The function `addLoader` asynchronously initalizes a loader using the provided parameters and adds
     * it to the system.
     * @param {LoaderParam} loaderParam - The `loaderParam` parameter is a string, object or instance of BaseLoader
     * that contains the necessary information to create a loader.
     * @returns The function `addLoader` returns an object with the following properties:
     * - `entriesAdded`: Number of new entries added during the loader operation
     * - `uniqueId`: Unique identifier of the loader
     * - `loaderType`: Name of the loader's constructor class
     */
    addLoader(loaderParam: LoaderParam): Promise<AddLoaderReturn>;
    /**
     * The function `_addLoader` asynchronously adds a loader, processes its chunks, and handles
     * incremental loading if supported by the loader.
     * @param {BaseLoader} loader - The `loader` parameter in the `_addLoader` method is an instance of the
     * `BaseLoader` class.
     * @returns The function `_addLoader` returns an object with the following properties:
     * - `entriesAdded`: Number of new entries added during the loader operation
     * - `uniqueId`: Unique identifier of the loader
     * - `loaderType`: Name of the loader's constructor class
     */
    private _addLoader;
    /**
     * The `incrementalLoader` function asynchronously processes incremental chunks for a loader.
     * @param {string} uniqueId - The `uniqueId` parameter is a string that serves as an identifier for
     * the loader.
     * @param incrementalGenerator - The `incrementalGenerator` parameter is an asynchronous generator
     * function that yields `LoaderChunk` objects. It is used to incrementally load chunks of data for a specific loader
     */
    private incrementalLoader;
    /**
     * The function `getLoaders` asynchronously retrieves a list of loaders loaded so far. This includes
     * internal loaders that were loaded by other loaders. It requires that cache is enabled to work.
     * @returns The list of loaders with some metadata about them.
     */
    getLoaders(): Promise<import("../global/types.js").LoaderList>;
    /**
     * The function `deleteLoader` deletes embeddings from a loader after confirming the action.
     * @param {string} uniqueLoaderId - The `uniqueLoaderId` parameter is a string that represents the
     * identifier of the loader that you want to delete.
     * @param {boolean} [areYouSure=false] - The `areYouSure` parameter is a boolean flag that
     * indicates whether the user has confirmed their intention to delete embeddings from a loader. If
     * `areYouSure` is `true`, the function proceeds with the deletion process. If `areYouSure` is
     * `false`, a warning message is logged and no action is taken
     * @returns The `deleteLoader` method returns a boolean value indicating the success of the operation.
     */
    deleteLoader(uniqueLoaderId: string, areYouSure?: boolean): Promise<boolean>;
    /**
     * The function `batchLoadChunks` processes chunks of data in batches and formats them for insertion.
     * @param {string} uniqueId - The `uniqueId` parameter is a string that represents a unique
     * identifier for loader being processed.
     * @param incrementalGenerator - The `incrementalGenerator` parameter in the `batchLoadChunks`
     * function is an asynchronous generator that yields `LoaderChunk` objects.
     * @returns The `batchLoadChunks` function returns an object with two properties:
     * 1. `newInserts`: The total number of new inserts made during the batch loading process.
     * 2. `formattedChunks`: An array containing the formatted chunks that were processed during the
     * batch loading process.
     */
    private batchLoadChunks;
    /**
     * The function `batchLoadEmbeddings` asynchronously loads embeddings for formatted chunks and
     * inserts them into a vector database.
     * @param {string} loaderUniqueId - The `loaderUniqueId` parameter is a unique identifier for the
     * loader that is used to load embeddings.
     * @param {Chunk[]} formattedChunks - `formattedChunks` is an array of Chunk objects that contain
     * page content, metadata, and other information needed for processing. The `batchLoadEmbeddings`
     * function processes these chunks in batches to obtain embeddings for each chunk and then inserts
     * them into a database for further use.
     * @returns The function `batchLoadEmbeddings` returns the result of inserting the embed chunks
     * into the vector database.
     */
    private batchLoadEmbeddings;
    /**
     * The function `getEmbeddingsCount` returns the count of embeddings stored in a vector database
     * asynchronously.
     * @returns The `getEmbeddingsCount` method is returning the number of embeddings stored in the
     * vector database. It is an asynchronous function that returns a Promise with the count of
     * embeddings as a number.
     */
    getEmbeddingsCount(): Promise<number>;
    /**
     * The function `deleteAllEmbeddings` deletes all embeddings from the vector database if a
     * confirmation is provided.
     * @param {boolean} [areYouSure=false] - The `areYouSure` parameter is a boolean parameter that
     * serves as a confirmation flag. It is used to ensure that the deletion of all embeddings is
     * intentional and requires the caller to explicitly confirm by passing `true` as the value. If
     * `areYouSure` is `false`, a warning message is logged.
     * @returns The `deleteAllEmbeddings` function returns a boolean value indicating the result.
     */
    deleteAllEmbeddings(areYouSure?: boolean): Promise<boolean>;
    /**
     * The function `getEmbeddings` retrieves embeddings for a query, performs similarity search,
     * filters and sorts the results based on relevance score, and returns a subset of the top results.
     * @param {string} cleanQuery - The `cleanQuery` parameter is a string that represents the query
     * input after it has been cleaned or processed to remove any unnecessary characters, symbols, or
     * noise. This clean query is then used to generate embeddings for similarity search.
     * @returns The `getEmbeddings` function returns a filtered and sorted array of search results based
     * on the similarity score of the query embedded in the cleanQuery string. The results are filtered
     * based on a relevance cutoff value, sorted in descending order of score, and then sliced to return
     * only the number of results specified by the `searchResultCount` property.
     */
    getEmbeddings(cleanQuery: string): Promise<import("../global/types.js").ExtractChunkData[]>;
    /**
     * The getContext function retrieves the unique embeddings for a given query without calling a LLM.
     * @param {string} query - The `query` parameter is a string that represents the input query that
     * needs to be processed.
     * @returns An array of unique page content items / chunks.
     */
    getContext(query: string): Promise<import("../global/types.js").ExtractChunkData[]>;
    /**
     * This function takes a user query, retrieves relevant context, identifies unique sources, and
     * returns the query result along with the list of sources.
     * @param {string} userQuery - The `userQuery` parameter is a string that represents the query
     * input provided by the user. It is used as input to retrieve context and ultimately generate a
     * result based on the query.
     * @param {string} [conversationId] - The `conversationId` parameter in the `query` method is an
     * optional parameter that represents the unique identifier for a conversation. It allows you to
     * track and associate the query with a specific conversation thread if needed. If provided, it can be
     * used to maintain context or history related to the conversation.
     * @returns The `query` method returns a Promise that resolves to an object with two properties:
     * `result` and `sources`. The `result` property is a string representing the result of querying
     * the LLM model with the provided query template, user query, context, and conversation history. The
     * `sources` property is an array of strings representing unique sources used to generate the LLM response.
     */
    query(userQuery: string, conversationId?: string, context?: Chunk[]): Promise<ConversationEntry>;
}
