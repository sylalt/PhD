import { useMemo } from 'react';

function selectRandomQuote(quotes) {
  if (!quotes.length) {
    return null;
  }

  return quotes[Math.floor(Math.random() * quotes.length)];
}

function FromYourReading({ quotes = [], status = 'ready' }) {
  const quote = useMemo(() => selectRandomQuote(quotes), [quotes]);

  return (
    <article className="card dashboard-card dashboard-reading-card">
      <div className="card-head">
        <h2>From your reading</h2>
      </div>

      {quote ? (
        <>
          <blockquote className="reading-quote">{quote.quote}</blockquote>
          <p className="reading-attribution">
            {[quote.authors, quote.year, quote.page && `p. ${quote.page}`].filter(Boolean).join(' · ')}
          </p>
          <p className="reading-paper-title">{quote.paperTitle}</p>
        </>
      ) : (
        <p className="empty reading-empty">{status === 'loading' ? 'Loading quotations…' : status === 'error' ? 'Quotations could not be loaded from Google Sheets.' : 'No quotations yet. Add a quote to the QUOTES tab in Google Sheets.'}</p>
      )}

    </article>
  );
}

export default FromYourReading;
