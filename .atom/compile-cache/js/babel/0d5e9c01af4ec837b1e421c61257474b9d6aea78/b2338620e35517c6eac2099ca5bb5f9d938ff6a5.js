var moment = require("moment");

/**
 * Parses the git commit revision from blame data for a line of code.
 *
 * @param {string} line - the blame data for a particular line of code
 * @return {string} - the git revision hash string.
 */
function parseRevision(line) {
  var revisionRegex = /^\w+/;
  return line.match(revisionRegex)[0];
}

/**
 * Parses the author name from blame data for a line of code.
 *
 * @param {string} line - the blame data for a particular line of code
 * @return {string} - the author name for that line of code.
 */
function parseAuthor(line) {
  var committerMatcher = /^author\s(.*)$/m;
  return line.match(committerMatcher)[1];
}

/**
 * Parses the committer name from blame data for a line of code.
 *
 * @param {string} line - the blame data for a particular line of code
 * @return {string} - the committer name for that line of code.
 */
function parseCommitter(line) {
  var committerMatcher = /^committer\s(.*)$/m;
  return line.match(committerMatcher)[1];
}

/**
 * Formats a date according to the user's preferred format string.
 * @param {object} date - a moment date object
 */
function formatDate(date) {
  var formatString = atom.config.get("git-blame.dateFormatString");
  return date.format(formatString);
}

/**
 * Parses the author date from blame data for a line of code.
 *
 * @param {string} line - the blame data for a particular line of code
 * @return {string} - human readable date string of the lines author date
 */
function parseAuthorDate(line) {
  var dateMatcher = /^author-time\s(.*)$/m;
  var dateStamp = line.match(dateMatcher)[1];
  return formatDate(moment.unix(dateStamp));
}

/**
 * Parses the commit date from blame data for a line of code.
 *
 * @param {string} line - the blame data for a particular line of code
 * @return {string} - human readable date string of the lines commit date
 */
function parseCommitterDate(line) {
  var dateMatcher = /^committer-time\s(.*)$/m;
  var dateStamp = line.match(dateMatcher)[1];
  return formatDate(moment.unix(dateStamp));
}

/**
 * Parses the summary line from the blame data for a line of code
 *
 * @param {string} line - the blame data for a particular line of code
 * @return {string} - the summary line for the last commit for a line of code
 */
function parseSummary(line) {
  var summaryMatcher = /^summary\s(.*)$/m;
  return line.match(summaryMatcher)[1];
}

/**
 * Parses the blame --porcelain output for a particular line of code into a
 * usable object with properties:
 *
 * commit: the commit revision
 * line: the line number (1 indexed)
 * committer: name of the committer of that line
 * date: the date of the commit
 * summary: the summary of the commit
 *
 * @param {string} blameData - the blame --porcelain output for a line of code
 * @param {number} index - the index that the data appeared in an array of line
 *    line data (0 indexed)
 * @return {object} - an object with properties described above
 */
function parseBlameLine(blameData, index) {
  return markIfNoCommit({
    hash: parseRevision(blameData),
    line: index + 1,
    author: parseAuthor(blameData),
    date: parseAuthorDate(blameData),
    committer: parseCommitter(blameData),
    committerDate: parseCommitterDate(blameData),
    summary: parseSummary(blameData)
  });
}

/**
 * Returns blameData object marked with property noCommit: true if this line
 * has not yet been committed.
 *
 * @param {object} parsedBlame - parsed blame info for a line
 */
function markIfNoCommit(parsedBlame) {
  if (/^0*$/.test(parsedBlame.hash)) {
    parsedBlame.noCommit = true;
  }
  return parsedBlame;
}

/**
 * Parses git-blame output into usable array of info objects.
 *
 * @param {string} blameOutput - output from 'git blame --porcelain <file>'
 */
function parseBlameOutput(blameOut) {
  // Matches new lines only when followed by a line with commit hash info that
  // are followed by autor line. This is the 1st and 2nd line of the blame
  // --porcelain output.
  var singleLineDataSplitRegex = /\n(?=\w+\s(?:\d+\s)+\d+\nauthor)/g;

  // Split the blame output into data for each line and parse out desired
  // data from each into an object.
  return blameOut.split(singleLineDataSplitRegex).map(parseBlameLine);
}

// EXPORTS
module.exports = {
  parseBlame: parseBlameOutput,
  formatDate: formatDate
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvdXRpbC9ibGFtZUZvcm1hdHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7Ozs7Ozs7O0FBUWpDLFNBQVMsYUFBYSxDQUFDLElBQUksRUFBRTtBQUMzQixNQUFJLGFBQWEsR0FBRyxNQUFNLENBQUM7QUFDM0IsU0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ3JDOzs7Ozs7OztBQVFELFNBQVMsV0FBVyxDQUFDLElBQUksRUFBRTtBQUN6QixNQUFJLGdCQUFnQixHQUFHLGlCQUFpQixDQUFDO0FBQ3pDLFNBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ3hDOzs7Ozs7OztBQVFELFNBQVMsY0FBYyxDQUFDLElBQUksRUFBRTtBQUM1QixNQUFJLGdCQUFnQixHQUFHLG9CQUFvQixDQUFDO0FBQzVDLFNBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ3hDOzs7Ozs7QUFNRCxTQUFTLFVBQVUsQ0FBQyxJQUFJLEVBQUU7QUFDeEIsTUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUNqRSxTQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7Q0FDbEM7Ozs7Ozs7O0FBUUQsU0FBUyxlQUFlLENBQUMsSUFBSSxFQUFFO0FBQzdCLE1BQUksV0FBVyxHQUFHLHNCQUFzQixDQUFDO0FBQ3pDLE1BQUksU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0MsU0FBTyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0NBQzNDOzs7Ozs7OztBQVFELFNBQVMsa0JBQWtCLENBQUMsSUFBSSxFQUFFO0FBQ2hDLE1BQUksV0FBVyxHQUFHLHlCQUF5QixDQUFDO0FBQzVDLE1BQUksU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0MsU0FBTyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0NBQzNDOzs7Ozs7OztBQVFELFNBQVMsWUFBWSxDQUFDLElBQUksRUFBRTtBQUMxQixNQUFJLGNBQWMsR0FBRyxrQkFBa0IsQ0FBQztBQUN4QyxTQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDdEM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJELFNBQVMsY0FBYyxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUU7QUFDeEMsU0FBTyxjQUFjLENBQUM7QUFDcEIsUUFBSSxFQUFFLGFBQWEsQ0FBQyxTQUFTLENBQUM7QUFDOUIsUUFBSSxFQUFFLEtBQUssR0FBRyxDQUFDO0FBQ2YsVUFBTSxFQUFFLFdBQVcsQ0FBQyxTQUFTLENBQUM7QUFDOUIsUUFBSSxFQUFFLGVBQWUsQ0FBQyxTQUFTLENBQUM7QUFDaEMsYUFBUyxFQUFFLGNBQWMsQ0FBQyxTQUFTLENBQUM7QUFDcEMsaUJBQWEsRUFBRSxrQkFBa0IsQ0FBQyxTQUFTLENBQUM7QUFDNUMsV0FBTyxFQUFFLFlBQVksQ0FBQyxTQUFTLENBQUM7R0FDakMsQ0FBQyxDQUFDO0NBQ0o7Ozs7Ozs7O0FBUUQsU0FBUyxjQUFjLENBQUMsV0FBVyxFQUFFO0FBQ2xDLE1BQUksTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDakMsZUFBVyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7R0FDN0I7QUFDRCxTQUFPLFdBQVcsQ0FBQztDQUNyQjs7Ozs7OztBQU9ELFNBQVMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFOzs7O0FBSWxDLE1BQUksd0JBQXdCLEdBQUcsbUNBQW1DLENBQUM7Ozs7QUFJbkUsU0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0NBQ3JFOzs7QUFHRCxNQUFNLENBQUMsT0FBTyxHQUFHO0FBQ2YsWUFBVSxFQUFFLGdCQUFnQjtBQUM1QixZQUFVLEVBQUUsVUFBVTtDQUN2QixDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9zc3VuLy5hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvdXRpbC9ibGFtZUZvcm1hdHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xuXG4vKipcbiAqIFBhcnNlcyB0aGUgZ2l0IGNvbW1pdCByZXZpc2lvbiBmcm9tIGJsYW1lIGRhdGEgZm9yIGEgbGluZSBvZiBjb2RlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBsaW5lIC0gdGhlIGJsYW1lIGRhdGEgZm9yIGEgcGFydGljdWxhciBsaW5lIG9mIGNvZGVcbiAqIEByZXR1cm4ge3N0cmluZ30gLSB0aGUgZ2l0IHJldmlzaW9uIGhhc2ggc3RyaW5nLlxuICovXG5mdW5jdGlvbiBwYXJzZVJldmlzaW9uKGxpbmUpIHtcbiAgdmFyIHJldmlzaW9uUmVnZXggPSAvXlxcdysvO1xuICByZXR1cm4gbGluZS5tYXRjaChyZXZpc2lvblJlZ2V4KVswXTtcbn1cblxuLyoqXG4gKiBQYXJzZXMgdGhlIGF1dGhvciBuYW1lIGZyb20gYmxhbWUgZGF0YSBmb3IgYSBsaW5lIG9mIGNvZGUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGxpbmUgLSB0aGUgYmxhbWUgZGF0YSBmb3IgYSBwYXJ0aWN1bGFyIGxpbmUgb2YgY29kZVxuICogQHJldHVybiB7c3RyaW5nfSAtIHRoZSBhdXRob3IgbmFtZSBmb3IgdGhhdCBsaW5lIG9mIGNvZGUuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlQXV0aG9yKGxpbmUpIHtcbiAgdmFyIGNvbW1pdHRlck1hdGNoZXIgPSAvXmF1dGhvclxccyguKikkL207XG4gIHJldHVybiBsaW5lLm1hdGNoKGNvbW1pdHRlck1hdGNoZXIpWzFdO1xufVxuXG4vKipcbiAqIFBhcnNlcyB0aGUgY29tbWl0dGVyIG5hbWUgZnJvbSBibGFtZSBkYXRhIGZvciBhIGxpbmUgb2YgY29kZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbGluZSAtIHRoZSBibGFtZSBkYXRhIGZvciBhIHBhcnRpY3VsYXIgbGluZSBvZiBjb2RlXG4gKiBAcmV0dXJuIHtzdHJpbmd9IC0gdGhlIGNvbW1pdHRlciBuYW1lIGZvciB0aGF0IGxpbmUgb2YgY29kZS5cbiAqL1xuZnVuY3Rpb24gcGFyc2VDb21taXR0ZXIobGluZSkge1xuICB2YXIgY29tbWl0dGVyTWF0Y2hlciA9IC9eY29tbWl0dGVyXFxzKC4qKSQvbTtcbiAgcmV0dXJuIGxpbmUubWF0Y2goY29tbWl0dGVyTWF0Y2hlcilbMV07XG59XG5cbi8qKlxuICogRm9ybWF0cyBhIGRhdGUgYWNjb3JkaW5nIHRvIHRoZSB1c2VyJ3MgcHJlZmVycmVkIGZvcm1hdCBzdHJpbmcuXG4gKiBAcGFyYW0ge29iamVjdH0gZGF0ZSAtIGEgbW9tZW50IGRhdGUgb2JqZWN0XG4gKi9cbmZ1bmN0aW9uIGZvcm1hdERhdGUoZGF0ZSkge1xuICB2YXIgZm9ybWF0U3RyaW5nID0gYXRvbS5jb25maWcuZ2V0KCdnaXQtYmxhbWUuZGF0ZUZvcm1hdFN0cmluZycpO1xuICByZXR1cm4gZGF0ZS5mb3JtYXQoZm9ybWF0U3RyaW5nKTtcbn1cblxuLyoqXG4gKiBQYXJzZXMgdGhlIGF1dGhvciBkYXRlIGZyb20gYmxhbWUgZGF0YSBmb3IgYSBsaW5lIG9mIGNvZGUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGxpbmUgLSB0aGUgYmxhbWUgZGF0YSBmb3IgYSBwYXJ0aWN1bGFyIGxpbmUgb2YgY29kZVxuICogQHJldHVybiB7c3RyaW5nfSAtIGh1bWFuIHJlYWRhYmxlIGRhdGUgc3RyaW5nIG9mIHRoZSBsaW5lcyBhdXRob3IgZGF0ZVxuICovXG5mdW5jdGlvbiBwYXJzZUF1dGhvckRhdGUobGluZSkge1xuICB2YXIgZGF0ZU1hdGNoZXIgPSAvXmF1dGhvci10aW1lXFxzKC4qKSQvbTtcbiAgdmFyIGRhdGVTdGFtcCA9IGxpbmUubWF0Y2goZGF0ZU1hdGNoZXIpWzFdO1xuICByZXR1cm4gZm9ybWF0RGF0ZShtb21lbnQudW5peChkYXRlU3RhbXApKTtcbn1cblxuLyoqXG4gKiBQYXJzZXMgdGhlIGNvbW1pdCBkYXRlIGZyb20gYmxhbWUgZGF0YSBmb3IgYSBsaW5lIG9mIGNvZGUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGxpbmUgLSB0aGUgYmxhbWUgZGF0YSBmb3IgYSBwYXJ0aWN1bGFyIGxpbmUgb2YgY29kZVxuICogQHJldHVybiB7c3RyaW5nfSAtIGh1bWFuIHJlYWRhYmxlIGRhdGUgc3RyaW5nIG9mIHRoZSBsaW5lcyBjb21taXQgZGF0ZVxuICovXG5mdW5jdGlvbiBwYXJzZUNvbW1pdHRlckRhdGUobGluZSkge1xuICB2YXIgZGF0ZU1hdGNoZXIgPSAvXmNvbW1pdHRlci10aW1lXFxzKC4qKSQvbTtcbiAgdmFyIGRhdGVTdGFtcCA9IGxpbmUubWF0Y2goZGF0ZU1hdGNoZXIpWzFdO1xuICByZXR1cm4gZm9ybWF0RGF0ZShtb21lbnQudW5peChkYXRlU3RhbXApKTtcbn1cblxuLyoqXG4gKiBQYXJzZXMgdGhlIHN1bW1hcnkgbGluZSBmcm9tIHRoZSBibGFtZSBkYXRhIGZvciBhIGxpbmUgb2YgY29kZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBsaW5lIC0gdGhlIGJsYW1lIGRhdGEgZm9yIGEgcGFydGljdWxhciBsaW5lIG9mIGNvZGVcbiAqIEByZXR1cm4ge3N0cmluZ30gLSB0aGUgc3VtbWFyeSBsaW5lIGZvciB0aGUgbGFzdCBjb21taXQgZm9yIGEgbGluZSBvZiBjb2RlXG4gKi9cbmZ1bmN0aW9uIHBhcnNlU3VtbWFyeShsaW5lKSB7XG4gIHZhciBzdW1tYXJ5TWF0Y2hlciA9IC9ec3VtbWFyeVxccyguKikkL207XG4gIHJldHVybiBsaW5lLm1hdGNoKHN1bW1hcnlNYXRjaGVyKVsxXTtcbn1cblxuLyoqXG4gKiBQYXJzZXMgdGhlIGJsYW1lIC0tcG9yY2VsYWluIG91dHB1dCBmb3IgYSBwYXJ0aWN1bGFyIGxpbmUgb2YgY29kZSBpbnRvIGFcbiAqIHVzYWJsZSBvYmplY3Qgd2l0aCBwcm9wZXJ0aWVzOlxuICpcbiAqIGNvbW1pdDogdGhlIGNvbW1pdCByZXZpc2lvblxuICogbGluZTogdGhlIGxpbmUgbnVtYmVyICgxIGluZGV4ZWQpXG4gKiBjb21taXR0ZXI6IG5hbWUgb2YgdGhlIGNvbW1pdHRlciBvZiB0aGF0IGxpbmVcbiAqIGRhdGU6IHRoZSBkYXRlIG9mIHRoZSBjb21taXRcbiAqIHN1bW1hcnk6IHRoZSBzdW1tYXJ5IG9mIHRoZSBjb21taXRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmxhbWVEYXRhIC0gdGhlIGJsYW1lIC0tcG9yY2VsYWluIG91dHB1dCBmb3IgYSBsaW5lIG9mIGNvZGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIHRoZSBpbmRleCB0aGF0IHRoZSBkYXRhIGFwcGVhcmVkIGluIGFuIGFycmF5IG9mIGxpbmVcbiAqICAgIGxpbmUgZGF0YSAoMCBpbmRleGVkKVxuICogQHJldHVybiB7b2JqZWN0fSAtIGFuIG9iamVjdCB3aXRoIHByb3BlcnRpZXMgZGVzY3JpYmVkIGFib3ZlXG4gKi9cbmZ1bmN0aW9uIHBhcnNlQmxhbWVMaW5lKGJsYW1lRGF0YSwgaW5kZXgpIHtcbiAgcmV0dXJuIG1hcmtJZk5vQ29tbWl0KHtcbiAgICBoYXNoOiBwYXJzZVJldmlzaW9uKGJsYW1lRGF0YSksXG4gICAgbGluZTogaW5kZXggKyAxLFxuICAgIGF1dGhvcjogcGFyc2VBdXRob3IoYmxhbWVEYXRhKSxcbiAgICBkYXRlOiBwYXJzZUF1dGhvckRhdGUoYmxhbWVEYXRhKSxcbiAgICBjb21taXR0ZXI6IHBhcnNlQ29tbWl0dGVyKGJsYW1lRGF0YSksXG4gICAgY29tbWl0dGVyRGF0ZTogcGFyc2VDb21taXR0ZXJEYXRlKGJsYW1lRGF0YSksXG4gICAgc3VtbWFyeTogcGFyc2VTdW1tYXJ5KGJsYW1lRGF0YSlcbiAgfSk7XG59XG5cbi8qKlxuICogUmV0dXJucyBibGFtZURhdGEgb2JqZWN0IG1hcmtlZCB3aXRoIHByb3BlcnR5IG5vQ29tbWl0OiB0cnVlIGlmIHRoaXMgbGluZVxuICogaGFzIG5vdCB5ZXQgYmVlbiBjb21taXR0ZWQuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHBhcnNlZEJsYW1lIC0gcGFyc2VkIGJsYW1lIGluZm8gZm9yIGEgbGluZVxuICovXG5mdW5jdGlvbiBtYXJrSWZOb0NvbW1pdChwYXJzZWRCbGFtZSkge1xuICAgaWYgKC9eMCokLy50ZXN0KHBhcnNlZEJsYW1lLmhhc2gpKSB7XG4gICAgIHBhcnNlZEJsYW1lLm5vQ29tbWl0ID0gdHJ1ZTtcbiAgIH1cbiAgIHJldHVybiBwYXJzZWRCbGFtZTtcbn1cblxuLyoqXG4gKiBQYXJzZXMgZ2l0LWJsYW1lIG91dHB1dCBpbnRvIHVzYWJsZSBhcnJheSBvZiBpbmZvIG9iamVjdHMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGJsYW1lT3V0cHV0IC0gb3V0cHV0IGZyb20gJ2dpdCBibGFtZSAtLXBvcmNlbGFpbiA8ZmlsZT4nXG4gKi9cbmZ1bmN0aW9uIHBhcnNlQmxhbWVPdXRwdXQoYmxhbWVPdXQpIHtcbiAgLy8gTWF0Y2hlcyBuZXcgbGluZXMgb25seSB3aGVuIGZvbGxvd2VkIGJ5IGEgbGluZSB3aXRoIGNvbW1pdCBoYXNoIGluZm8gdGhhdFxuICAvLyBhcmUgZm9sbG93ZWQgYnkgYXV0b3IgbGluZS4gVGhpcyBpcyB0aGUgMXN0IGFuZCAybmQgbGluZSBvZiB0aGUgYmxhbWVcbiAgLy8gLS1wb3JjZWxhaW4gb3V0cHV0LlxuICB2YXIgc2luZ2xlTGluZURhdGFTcGxpdFJlZ2V4ID0gL1xcbig/PVxcdytcXHMoPzpcXGQrXFxzKStcXGQrXFxuYXV0aG9yKS9nO1xuXG4gIC8vIFNwbGl0IHRoZSBibGFtZSBvdXRwdXQgaW50byBkYXRhIGZvciBlYWNoIGxpbmUgYW5kIHBhcnNlIG91dCBkZXNpcmVkXG4gIC8vIGRhdGEgZnJvbSBlYWNoIGludG8gYW4gb2JqZWN0LlxuICByZXR1cm4gYmxhbWVPdXQuc3BsaXQoc2luZ2xlTGluZURhdGFTcGxpdFJlZ2V4KS5tYXAocGFyc2VCbGFtZUxpbmUpO1xufVxuXG4vLyBFWFBPUlRTXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcGFyc2VCbGFtZTogcGFyc2VCbGFtZU91dHB1dCxcbiAgZm9ybWF0RGF0ZTogZm9ybWF0RGF0ZVxufTtcbiJdfQ==