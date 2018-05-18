# Importer-v.01
Imports data between files with conditions.

Landing page:
https://sheetswithmaxmakhrov.wordpress.com/2018/04/10/importer/


When the installation is finished, you'll have 2 sheets that store all info used by the script. Sheet \Ini/ holds all the data for the script. Sheet \Settings/ serves you to set the import.

In "Settings" each line is one connection. Fill "Settings" with your connections:

<img class="alignnone size-full wp-image-1261" src="https://sheetswithmaxmakhrov.files.wordpress.com/2018/04/importer11211.png" alt="Importer1121" width="679" height="367" />

Each column is the required field of the connection. You'll answer 3 questions: <strong><span style="color: #99cc00;">what to import</span></strong>, <span style="color: #00ccff;"><strong>where</strong></span>, and <strong><span style="color: #ff9900;">how</span></strong>:
<table>
<thead>
<tr>
<th>Field</th>
<th><span style="color: #ffffff;">      </span></th>
<th>Meaning</th>
</tr>
</thead>
<tbody>
<tr bgcolor="#d2ff4d">
<td><strong>Document ID</strong></td>
<td></td>
<td>The ID of the file you want to import:

<code>1MFAR0QVUyQaLvgs5HfdM1NxV1oL2ynLWxvBMdjDEVaQ</code></td>
</tr>
<tr bgcolor="#d2ff4d">
<td><strong>Sheet Name</strong></td>
<td></td>
<td>The name of the sheet you want to import:

<code>Sheet1</code></td>
</tr>
<tr bgcolor="#d2ff4d">
<td><strong>First row with data</strong></td>
<td></td>
<td>The address of the first row with data to import:

<code>a1:z1</code></td>
</tr>
<tr bgcolor="#b3daff">
<td><strong>Document ID To</strong></td>
<td></td>
<td>The ID of the target file where you want to insert the imported data. It may be the same:

<code>1MFAR0QVUyQaLvgs5HfdM1NxV1oL2ynLWxvBMdjDEVaQ</code></td>
</tr>
<tr bgcolor="#b3daff">
<td><strong>Sheet Write To</strong></td>
<td></td>
<td>The name of the target sheet where you want to insert the imported data:

<code>My Target Sheet</code></td>
</tr>
<tr bgcolor="#ffcc66">
<td><strong>Query</strong></td>
<td></td>
<td>Edit the result with a query. If you want to import all the data as it is, paste this text:

<code>SELECT * FROM ?</code></td>
</tr>
</tbody>
</table>

After you finish with settings:
<ol>
	<li>Launch import: <code>Admin</code> > <code>Update</code>. Do it any time you need to refresh your data.</li>
	<li>Run import hourly: <code>Admin</code> > <code>Install</code> > <code>Set 1 Hour Trigger</code>. Do it once and the trigger will run constantly.</li>
</ol>

If you want to add more connections, set them in new lines, and the Importer will adjust new settings automatically.
