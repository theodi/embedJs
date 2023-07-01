# EmbedJS

EmbedJS is a framework to easily create LLM powered bots over any dataset.

It abstracts the entire process of loading a dataset, chunking it, creating embeddings and then storing in a vector database.

Here's an example

```TS
const llmApplication = await new LLMApplicationBuilder()
    .setTemperature(0.1)
    .addLoader(new PdfLoader({ filePath: path.resolve('../paxos-simple.pdf') }))
    .addLoader(new YoutubeLoader({ videoIdOrUrl: 'https://www.youtube.com/watch?v=w2KbwC-s7pY' }))
    .addLoader(new TextLoader({ text: 'The best name for a company making colorful socks is MrSocks' }))
    .setVectorDb(new LanceDb({ path: path.resolve('/db') }))
    .build();

console.log(await llmApplication.query('What is paxos?'));
// Output: Paxos is an algorithm for implementing a fault-tolerant distributed system. It assumes a network of processes, each of which plays the role of proposer, acceptor, and learner. The algorithm chooses a leader, which plays the roles of the distinguished proposer and learner. The algorithm is used to reach consensus on a chosen value, and is obtained by the straightforward application of consensus to the state machine approach for building a distributed system.

console.log(await llmApplication.query('Why Does the M2 Mac Pro Exist?'));
// Output: The Mac Pro exists to provide users with a powerful and expandable workstation-class computer.

console.log(await llmApplication.query('What is the best name for a company making colorful socks?'));
// Output: MrSocks
```

The library comes with built in loaders for PDFs, Youtube videos, custom text and web pages. You can bring your own custom loader.

You have the choice of vector database to store the results. The library comes with built in support for Pinecone and Lance databases. You can also add a custom database.

The library also supports caches which provide caching for embeddings, loaders and optionally queries. Chunks that are already seen are not re-processed. Similarly, entire loaders are cached and not processed if they have been already encountered. Read below for more information on this.

# Contents

-   [Getting started](#getting-started)
    -   [Installation](#installation)
    -   [Usage](#usage)
-   [Loaders supported](#loaders-supported)
    -   [Youtube](#youtube-video)
    -   [PDF](#pdf-file)
    -   [Web page](#web-page)
    -   [Text](#text)
    -   [Custom loader](#add-a-custom-loader)
    -   [How to request more loaders](#more-loaders-coming-soon)
-   [Vector databases supported](#vector-databases-supported)
    -   [Pinecone](#pinecone)
    -   [LanceDB](#lancedb)
    -   [Own Database](#bring-your-own-database)
    -   [How to request new vector databases](#more-databases-coming-soon)
-   [Caches](#caches)
    -   [LMDB](#lmdb)
    -   [In memory cache](#inmemory)
    -   [Custom cache implementation](#bring-your-own-cache)
    -   [How to request new cache providers](#more-caches-coming-soon)
-   [Usage with Azure OpenAI](#azure-openai)
-   [Dependencies](#core-dependencies)
-   [Author](#author)

# Getting started

## Installation

You can install the library via NPM or Yarn

```bash
npm install embedjs
```

## Usage

-   We use OpenAI's embedding model to create embeddings for chunks and ChatGPT API as LLM to get answer given the relevant docs. Make sure that you have an OpenAI account and an API key. If you have dont have an API key, you can create one by visiting [this link](https://platform.openai.com/account/api-keys).

-   Once you have the API key, set it in an environment variable called `OPENAI_API_KEY`. There is also built in support for **Azure OpenAI**. Check the section on this at the end.

```bash
OPENAI_API_KEY="sk-<REST_OF_YOUR_KEY>"
```

-   Next import and use the `LLMApplicationBuilder` to construct an `LLMApplication`. The builder has all the options to configure the application in full.

```TS
import * as path from 'node:path';

import {
    LLMApplicationBuilder,
    LmdbCache,
    PdfLoader,
    PineconeDb,
    TextLoader,
    YoutubeLoader,
} from '../../../src/index.js';

const llmApplication = await new LLMApplicationBuilder()
    .addLoader(new PdfLoader({ filePath: path.resolve('../paxos-simple.pdf') }))
    .addLoader(new YoutubeLoader({ videoIdOrUrl: 'https://www.youtube.com/watch?v=w2KbwC-s7pY' }))
    .addLoader(new TextLoader({ text: 'The best company name for a company making colorful socks is MrSocks' }))
    .setCache(new LmdbCache({ path: path.resolve('./cache') }))
    .setVectorDb(new PineconeDb({ projectName: 'test', namespace: 'dev' }))
    .build();
```

-   Now that you have your instance of `LLMApplication`, you can use it to query against the data set, like so -

```TS
await llmApplication.query('What is paxos?');
```

-   You can also add additional loaders after you have your instance of `LLMApplication` by invoking the method `addLoader`

```TS
llmApplication.addLoader(
    new TextLoader({ text: 'This content was added at a later time as more info was available.' }),
);
```

# Loaders supported

Currently, the library supports the following formats -

## Youtube video

To add any youtube video to your app, use `YoutubeLoader`.

```TS
.addLoader(new YoutubeLoader({ videoIdOrUrl: 'w2KbwC-s7pY' }))
```

## PDF file

To add a pdf file, use `PdfLoader`.

```TS
.addLoader(new PdfLoader({ filePath: path.resolve('paxos-simple.pdf') }))
```

**Note:** Currently there is no support for PDF forms and password protected documents

## Web page

To add a web page, use `WebLoader`.

```TS
.addLoader(new WebLoader({ url: 'https://en.wikipedia.org/wiki/Formula_One' }))
```

## Text

To supply your own text, use `TextLoader`.

```TS
.addLoader(new TextLoader({ text: 'The best company name for a company making colorful socks is MrSocks' }))
```

**Note:** Feel free to add your custom text without worrying about duplication. The library will chuck, cache and update the vector databases.

## Add a custom loader

You can pass along a custom loader to the `addLoader` method by extending and implementing the abstract class `BaseLoader`. Here's how that would look like -

```TS
class CustomLoader extends BaseLoader<{ customChunkMetadata: string }> {
    constructor() {
        super('uniqueId');
    }

    async getChunks(): Promise<Chunk<{ customChunkMetadata: string }>[]> {
        throw new Error('Method not implemented.');
    }
}
```

We really encourage you send in a PR to this library if you are implementing a common loader pattern, so the community can benefit from it.

## More loaders coming soon

If you want to add any other format, please create an [issue](https://github.com/llmembed/embedjs/issues) and we will add it to the list of supported formats. All PRs are welcome.

# Vector databases supported

The library allows you to save your processed and unique embeddings with the vector databases of your choice. Here are the supported databases right now -

## Pinecone

You can enable Pinecone storage by following these steps -

-   Create an account with [Pinecone](https://www.pinecone.io/) if you don't have one already. There is a _good free tier_.

-   Install pinecone package in your project

```bash
npm install @pinecone-database/pinecone
```

-   Set the pinecone environment variables `PINECONE_API_KEY` and `PINECONE_ENVIRONMENT`. These can be obtained from the **API Keys** section on the Pinecone dashboard.

```bash
PINECONE_API_KEY="e65a4ec0-14f7-40c5-903e-f8529127b817"
PINECONE_ENVIRONMENT="us-west1-gcp-free"
```

-   Set the Pinecone database as your choice of `vectorDb`

```TS
.setVectorDb(new PineconeDb({ projectName: 'test', namespace: 'dev' }))
```

**Note:** The `projectName` will be used to create the Pinecone index name for this application.

## LanceDB

[LanceDB](https://lancedb.com/) is a local vector database with great performance. Follow these steps to use LanceDB as your vector database -

-   Install LanceDb package in your project

```bash
npm install vectordb
```

-   Set LanceDB database as your choice of `vectorDb`

```TS
.setVectorDb(new LanceDb({ path: path.resolve('/db') }))
```

**Note:** The `path` property will be used by LanceDB to create a directory to host all the database files. There is also support for creating temporary directories for testing -

```TS
.setVectorDb(new LanceDb({ path: 'lance-', isTemp: true }))
```

In this case, the `path` property is used as a prefix to create the temporary directory in the OS temp directory folder.

## Bring your own database

You can pass along your vector database to the `setVectorDb` method by implementing the interface `BaseDb`. Here's how that would look like -

```TS
class MyOwnDb implements BaseDb {
    async init(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async insertChunks(chunks: EmbeddedChunk[]): Promise<number> {
        throw new Error('Method not implemented.');
    }

    async similaritySearch(query: number[], k: number): Promise<Chunk[]> {
        throw new Error('Method not implemented.');
    }
}
```

We really encourage you send in a PR to this library if you are implementing a famous or common database, so the community can benefit from it.

## More databases coming soon

If you want to add support for any other vector database, please create an [issue](https://github.com/llmembed/embedjs/issues) and we will add it to the list of supported databases. All PRs are welcome.

# Caches

Caches serve to reduce re-processing embeddings, loaders and queries. There is no need to load, chunk and store a large PDF File or web page on every run. Caching smartly is built in and can be enabled out of the box simply by setting a cache processor using the method `setCache` while building the `LLMApplication`.

The library supports the following caches -

## LMDB

You can use [LMDB](https://dbdb.io/db/lmdb) to cache values locally on disk.

-   Install LMDB package in your project

```bash
npm install lmdb
```

-   Set `LmdbCache` as your cache provider on `LLMApplicationBuilder`

```TS
await new LLMApplicationBuilder()
.setCache(new LmdbCache({ path: path.resolve('./cache') }))
```

**Note:** The `path` property will be used by the LMDB driver to create a folder housing the LMDB database files.

## InMemory

You can use a simple in-memory cache to store values during testing.

-   Set `MemoryCache` as your cache provider on `LLMApplicationBuilder`

```TS
await new LLMApplicationBuilder()
.setCache(new MemoryCache())
```

**Note:** Although this cache can remove duplicate loaders and chunks, its store does not persist between process restarts. You should only be using it for testing.

## Bring your own cache

You can pass along your own cache provider to the `setCache` method by implementing the interface `BaseCache`. Here's how that would look like -

```TS
class MyOwnCache implements BaseCache {
    async init(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async addSeen(chunkHash: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async hasSeen(chunkHash: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}
```

We really encourage you send in a PR to this library if you are implementing a famous or common cache provider, so the community can benefit from it.

## More caches coming soon

If you want to add support for any other cache providers, please create an [issue](https://github.com/llmembed/embedjs/issues) and we will add it to the list of supported caches. All PRs are welcome.

# Azure OpenAI

In order to be able to use an OpenAI model on Azure, it first needs to be deployed. Please refer to [Azure OpenAI documentation](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/) on how to deploy a model on Azure. To run this library, you will need to deploy two models -

-   text-embedding-ada
-   GPT-3.5-turbo

Once these models are deployed, using Azure OpenAI instead of the regular OpenAI is easy to do. Just follow these steps -

-   Remove the `OPENAI_API_KEY` environment variable if you have set it already.

-   Set the following environment variables -

```bash
# Set this to `azure`
export OPENAI_API_TYPE=azure
# The API version you want to use
export OPENAI_API_VERSION=2023-03-15-preview
# The base URL for your Azure OpenAI resource.  You can find this in the Azure portal under your Azure OpenAI resource.
export OPENAI_API_BASE=https://your-resource-name.openai.azure.com
# The API key for your Azure OpenAI resource.  You can find this in the Azure portal under your Azure OpenAI resource.
export OPENAI_API_KEY=<Your Azure OpenAI API key>
```

**NOTE:** At the time of writing this, Azure OpenAI is an invite only program.

# Core dependencies

EmbedJS is built on top of the fantastic work being done on OpenAI and the open source community behind it. Internally it uses -

-   [Langchain](https://github.com/hwchase17/langchain) as an LLM library to load and chunk data
-   [OpenAI's Ada embedding model](https://platform.openai.com/docs/guides/embeddings) to create embeddings
-   [OpenAI's ChatGPT API](https://platform.openai.com/docs/guides/gpt/chat-completions-api) as the LLM to get answers to prompts.

# Author

-   [K V Adhityan](https://adhityan.com/)

Looking for contrbutors to add to the list above.