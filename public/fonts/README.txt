Optional. Drop these four .woff2 files here to enable the intended typography:

  FrankRuhlLibre-Bold.woff2          (display / headings)
  Assistant-Regular.woff2            (body)
  Assistant-SemiBold.woff2           (body, bold)
  IBMPlexSansHebrew-SemiBold.woff2   (labels, Latin terms)

All three families are open source and available from Google Fonts. Download
the Hebrew subset as woff2 and place the files here.

The site works without them — src/styles/index.css declares local() and
system fallbacks first, so nothing breaks. You just get system Hebrew faces
instead of the intended ones.
