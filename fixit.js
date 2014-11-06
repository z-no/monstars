// It's late and I'm a little tipsy, so I thought this would be a good time
// to summarize the motivation behind this tool:
// blergh


// global variables are good practice
// or maybe it's the exact opposite of that, hmmm
var titles;
var starters;
var bench;
var table;


// position should be the position like: PG or C
// player_team_pos is the contents of the positions array for a player
function can_occupy(position, player_positions)
{
	if(position == 'UTIL')
		return true;
	if(player_positions.indexOf(position) != -1)
		return true;
	if(position == 'G' && (player_positions.indexOf('SG') != -1 || player_positions.indexOf('PG') != -1))
		return true;
	if(position == 'F' && (player_positions.indexOf('SF') != -1 || player_positions.indexOf('PF') != -1))
		return true;
	return false;
}

// they solve the math behind this in an episode of Futurama, don't they?

function is_playing(player)
{
	if(player['OPP'])
		return true;
	return false;
}

function is_injured(player)
{
	if(player['status'] = 'O')
		return true;
	return false;
}

function setup()
{
	elements = document.getElementsByClassName("playerTableTable");

	table = elements[0];

	//get the titles like SLOT and REB

	first_row = table.rows[1];

	titles = new Array();

	for(var i = 0; col = first_row.cells[i]; i++)
	{
		titles[i] = col.innerText;
	}

	// look at the starters first

	starters = new Array();

	for(var i = 2; i < 10; i++)
	{
		row = table.rows[i];
		starters[i-2] = new Array();
		for(var j = 0; col = row.cells[j]; j++)
		{
			starters[i-2][titles[j]] = col.innerText;
		}
		

		// I'm right at the point where I get whats happening here but I can't really explain it
		// like you're gonna have some stuff. Can i be a point guard?  No, probably not.
		var str_to_split = starters[i-2]['PLAYER, TEAM POS'];
		str_to_split = str_to_split.replace(/,/g, '');
		str_to_split = str_to_split.replace(/&nbsp/g, ' ');
		var what = str_to_split.split(/\s+/);
		starters[i-2]['status'] = what[what.length - 1];
		what.splice(0, 3);
		starters[i-2]['positions'] = what;
		var status = starters[i-2]['positions'].pop();
		if(status == 'O' || status == 'DTD')
		{
			starters[i-2]['status'] = status;
		}
		else
		{
			starters[i-2]['status'] = 'OK';
			starters[i-2]['positions'].push(status);
		}
	}

	// now who's on the bench

	bench = new Array();
	for(var i = 12; i < 18; i++)
	{
		row = table.rows[i];
		bench[i-12] = new Array();
		for(var j = 0; col = row.cells[j]; j++)
		{
			bench[i-12][titles[j]] = col.innerText;
		}

		var str_to_split = bench[i-12]['PLAYER, TEAM POS'];
		str_to_split = str_to_split.replace(/,/g, '');
		str_to_split = str_to_split.replace(/&nbsp/g, ' ');
		var what = str_to_split.split(/\s+/);
		what.splice(0, 3);
		bench[i-12]['positions'] = what;
		var status = bench[i-12]['positions'].pop();
		if(status == 'O' || status == 'DTD')
		{
			bench[i-12]['status'] = status;
		}
		else
		{
			bench[i-12]['status'] = 'OK';
			bench[i-12]['positions'].push(status);
		}
	}
}

// move a starter to another starter spot
function move(spot1, spot2)
{
	table.rows[spot1 + 2].cells[2].getElementsByClassName('pncButtonMove')[0].click();

	table.rows[spot2 + 2].cells[2].getElementsByClassName('pncButtonHere')[0].click();

	var a; // you need a swapping variable here, education validated!
	a = starters[spot1];
	starters[spot1] = starters[spot2];
	starters[spot2] = a;
}

// I'm ready to go in, coach, just give me a chance. 
// I know there's a lot of riding on it, but it's all psychological. 
// Just gotta stay in a positive frame of mind.
// I'm gonna execute a button hook pattern, super slo-mo.
function put_me_in_coach(bench_spot, starter_spot)
{
	console.log(table.rows[starter_spot + 2].cells[2].getElementsByClassName('pncButtonHere')[0]);
	table.rows[bench_spot + 12].cells[2].getElementsByClassName('pncButtonMove')[0].click();

	table.rows[starter_spot + 2].cells[2].getElementsByClassName('pncButtonHere')[0].click();

	var a;
	a = bench[bench_spot];
	bench[bench_spot] = starters[starter_spot];
	starters[starter_spot] = a;
}

// this function just makes sure there are no empty spots that
// could be occupied by people on the bench
function check_starters()
{
	// this for loop should not have a hard coded value, nerd!
	for(var i = 0; i < 8; i++)
	{
		// if you're not playing today
		if(starters[i]['OPP'] == '')
		{
			console.log(starters[i]['PLAYER, TEAM POS'] + ' not playing');
			for(var j = 0; j < 6; j++)
			{
				console.log(bench[j]['PLAYER, TEAM POS']);
				if(bench[j]['OPP'] != '' && can_occupy(starters[i]['SLOT'], bench[j].positions))
				{
					put_me_in_coach(j, i);
					continue;
				}
			}
		}
	}
}

function submit()
{
	document.getElementById('pncSaveRoster1').click();
}

setup();

check_starters();

submit();