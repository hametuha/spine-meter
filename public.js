import React from 'react';
import { render } from 'react-dom';

class SpineForm extends React.Component {

	constructor( props ) {
		super( props );
		this.state = {
			initialized: false,
			amount: 0,
			lines: 15,
			chars: 45,
			unit: 400,
			sections: 1,
			thickness: .12,
			density: 0.9,
			chapters: 1,
		};
	}

	page() {
		const { amount, lines, chars, unit, density, thickness } = this.state;
		let pages = amount * unit / chars / lines;
		pages = Math.ceil( pages / density );
		if ( 0 !== pages % 2 ) {
			pages += 1;
		}
		pages += 4; // Front matters.
		pages += 4; // Colophon.
		return pages;
	}

	extraPages() {
		return ( this.state.sections - 1 ) * 2;
	}

	totalPage() {
		return this.page() + this.extraPages();
	}

	render() {
		const { amount, unit, lines, chars, sections, thickness, density } = this.state;
		return (
			<>
				<div className="field is-horizontal">
					<div className="field-label is-normal">
						<label className="label">総数</label>
					</div>
					<div className="field-body">
						<div className="field">
							<div className="control">
								<input className="input" type="number" placeholder="300" value={ amount } onChange={ ( newAmount ) => this.setState( { amount: parseInt( newAmount.target.value, 10 ) } ) }/>
							</div>
						</div>
						<div className="field">
							<div className="control">
								<div className="select">
									<select onChange={ ( event ) => this.setState( { unit: parseInt( event.target.value, 10 ) } ) }>
										<option selected={ 400 === unit } value={ 400 }>× 400字詰め原稿用紙</option>
										<option selected={ 1 === unit } value={ 1 }>文字</option>
									</select>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="field is-horizontal">
					<div className="field-label is-normal">
						<label className="label">ページ構成</label>
					</div>
					<div className="field-body">
						<div className="field">
							<div className="control">
								<label>
									ページあたり行数
									<input className="input" type="number" placeholder="16" value={ lines } onChange={ ( e ) => this.setState( { lines: parseInt( e.target.value, 10 ) } ) }/>
								</label>
							</div>
						</div>
						<div className="field">
							<div className="control">
								<label>
									1行の文字数
									<input className="input" type="number" placeholder="45" value={ chars } onChange={ ( e ) => this.setState( { chars: parseInt( e.target.value, 10 ) } ) }/>
								</label>
							</div>
						</div>
						<div className="field">
							<div className="control">
								<label>
									収録作・章数
									<input className="input" type="number" placeholder="1" value={ sections } onChange={ ( e ) => this.setState( { sections: parseInt( e.target.value, 10 ) } ) }/>
								</label>
							</div>
						</div>
						<div className="field">
							<div className="control">
								<label>
									ページ濃度（パーセント）
									<input className="input" type="number" placeholder="90" value={ density * 100 } onChange={ ( e ) => this.setState( { density: parseInt( e.target.value, 10 ) / 100 } ) }/>
								</label>
							</div>
						</div>
						<div className="field">
							<div className="control">
								<label>
									紙厚（mm）
									<input className="input" step={ 0.01 } type="number" placeholder="0.12" value={ thickness } onChange={ ( e ) => this.setState( { thickness: parseFloat( e.target.value ) } ) }/>
								</label>
							</div>
						</div>
					</div>
				</div>
				<hr />
				{ ( 0 < amount ) ? (
					<table className="table is-fullwidth">
						<caption>推測値</caption>
						<thead>
						<tr>
							<th>ページ数</th>
							<th>背幅</th>
							<th>台数</th>
						</tr>
						</thead>
						<tbody>
						<tr>
							<td>{ this.totalPage() }ページ</td>
							<td>{ Math.floor( Math.ceil( this.totalPage() / 2 ) * thickness ) }mm</td>
							<td>{ Math.floor( this.totalPage() / 16 ) }<small>（余り{ this.totalPage() % 16 }）</small></td>
						</tr>
						</tbody>
					</table>
				) : (
					<article className="message">
						<div className="message-body">
							原稿用紙枚数または文字数を入力してください。
						</div>
					</article>
				) }
			</>
		);
	}
}

render( <SpineForm />, document.getElementById( 'spine-meter' ) );
